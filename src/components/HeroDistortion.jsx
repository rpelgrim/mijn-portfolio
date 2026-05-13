import { useEffect, useRef } from 'react'
import heroVideo from '../assets/hero-video-rp.mp4'

const vert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const frag = /* glsl */`
  precision mediump float;

  uniform sampler2D uTex;
  uniform vec2      uMouse;
  uniform float     uStrength;
  uniform float     uTime;
  uniform vec2      uResolution;
  uniform vec2      uImageSize;

  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float sAspect = uResolution.x / uResolution.y;
    float iAspect = uImageSize.x  / uImageSize.y;
    vec2 scale = sAspect > iAspect
      ? vec2(1.0, iAspect / sAspect)
      : vec2(sAspect / iAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 diff = vUv - uMouse;
    diff.x *= uResolution.x / uResolution.y;
    float dist = length(diff);

    float radius = 0.4;
    float ripple = sin(dist * 20.0 - uTime * 6.0)
      * smoothstep(radius, 0.0, dist)
      * uStrength;

    vec2 dir    = normalize(vUv - uMouse + vec2(0.0001));
    vec2 offset = dir * ripple * 0.025;

    vec4 color = texture2D(uTex, coverUv(vUv + offset));
    gl_FragColor = color;
  }
`

function HeroDistortion() {
  const canvasRef = useRef(null)
  const videoRef  = useRef(null)

  const isTouch = window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    /* Scrub video mee met scrollpositie */
    const scrub = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0 || !video.duration) return
      video.currentTime = (window.scrollY / max) * video.duration
    }
    window.addEventListener('scroll', scrub, { passive: true })

    if (isTouch) {
      return () => window.removeEventListener('scroll', scrub)
    }

    /* Desktop: Three.js shader met VideoTexture */
    const canvas = canvasRef.current
    let cancelled = false
    let dispose   = null

    import('three').then((THREE) => {
      if (cancelled) return

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const scene  = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const geo    = new THREE.PlaneGeometry(2, 2)

      const resolution = new THREE.Vector2()
      const imageSize  = new THREE.Vector2(1920, 1080)

      const texture = new THREE.VideoTexture(video)
      texture.minFilter = THREE.LinearFilter

      video.addEventListener('loadedmetadata', () => {
        imageSize.set(video.videoWidth, video.videoHeight)
      })

      const uniforms = {
        uTex:        { value: texture },
        uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
        uStrength:   { value: 0 },
        uTime:       { value: 0 },
        uResolution: { value: resolution },
        uImageSize:  { value: imageSize },
      }

      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag })
      scene.add(new THREE.Mesh(geo, mat))

      const resize = () => {
        const { width, height } = canvas.parentElement.getBoundingClientRect()
        renderer.setSize(width, height)
        resolution.set(width, height)
      }
      resize()
      window.addEventListener('resize', resize)

      let targetStrength = 0
      let currentStrength = 0
      const targetMouse = new THREE.Vector2(0.5, 0.5)
      let rafId = null
      let idleTimer = null

      const tick = (t) => {
        if (cancelled) return
        texture.needsUpdate       = true
        uniforms.uTime.value      = t * 0.001
        currentStrength          += (targetStrength - currentStrength) * 0.05
        uniforms.uStrength.value  = currentStrength
        uniforms.uMouse.value.lerp(targetMouse, 0.08)
        renderer.render(scene, camera)
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)

      const onMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect()
        targetMouse.set(
          (e.clientX - rect.left) / rect.width,
          1.0 - (e.clientY - rect.top) / rect.height
        )
        targetStrength = 1
        clearTimeout(idleTimer)
        idleTimer = setTimeout(() => { targetStrength = 0 }, 150)
      }

      canvas.parentElement.addEventListener('mousemove', onMouseMove)

      dispose = () => {
        window.removeEventListener('resize', resize)
        canvas.parentElement?.removeEventListener('mousemove', onMouseMove)
        clearTimeout(idleTimer)
        if (rafId) cancelAnimationFrame(rafId)
        texture.dispose()
        renderer.dispose()
        mat.dispose()
        geo.dispose()
      }
    })

    return () => {
      cancelled = true
      dispose?.()
      window.removeEventListener('scroll', scrub)
    }
  }, [])

  return (
    <>
      {/* Video element — zichtbaar op touch, verborgen op desktop (gebruikt als texture) */}
      <video
        ref={videoRef}
        src={heroVideo}
        muted
        playsInline
        preload="auto"
        style={isTouch ? {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          pointerEvents: 'none',
          zIndex: 0,
        } : {
          display: 'none',
        }}
      />

      {!isTouch && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
    </>
  )
}

export default HeroDistortion
