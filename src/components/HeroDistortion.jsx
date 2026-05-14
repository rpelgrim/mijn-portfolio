import { useEffect, useRef } from 'react'

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

/* Alle frames als gesorteerde URL-array via Vite glob */
const frameModules = import.meta.glob('../assets/hero-frames/*.jpg', { eager: true })
const FRAME_URLS = Object.keys(frameModules).sort().map(k => frameModules[k].default)

/* Intro speelt frames 0–19 (frame_0001–frame_0020) automatisch af.
   Daarna pakt scroll over vanaf index 19 tot het einde. */
const INTRO_END   = 19   // laatste frame van de intro (0-geïndexeerd)
const INTRO_FPS   = 24   // afspeelsnelheid intro

function HeroDistortion() {
  const canvasRef = useRef(null)
  const isTouch = window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    /* Preload alle frames */
    const images = FRAME_URLS.map(url => {
      const img = new Image()
      img.src = url
      return img
    })

    let introComplete = false

    /* Scroll-index: start pas na intro, mapt scroll naar frames INTRO_END–einde */
    const getFrameIndex = () => {
      if (!introComplete) return INTRO_END
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return INTRO_END
      const scrollable = images.length - 1 - INTRO_END
      return INTRO_END + Math.round(Math.min(window.scrollY / max, 1) * scrollable)
    }

    /* Intro-animatie: speelt frames 0 t/m INTRO_END af op INTRO_FPS.
       isCancelled wordt als functie meegegeven zodat de juiste cancelled-flag
       per pad (touch/desktop) wordt uitgelezen. */
    const playIntro = (showFrameFn, onDone, isCancelled) => {
      let frame = 0
      let lastTime = null
      const interval = 1000 / INTRO_FPS

      const step = (t) => {
        if (isCancelled()) return
        if (lastTime === null) lastTime = t
        if (t - lastTime >= interval) {
          showFrameFn(frame)
          frame++
          lastTime = t
          if (frame > INTRO_END) {
            introComplete = true
            onDone?.()
            return
          }
        }
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    /* Touch: Canvas 2D image sequence */
    if (isTouch) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let currentIndex = -1
      let cancelled = false

      const setSize = () => {
        canvas.width  = canvas.offsetWidth  * devicePixelRatio
        canvas.height = canvas.offsetHeight * devicePixelRatio
      }
      setSize()
      window.addEventListener('resize', setSize)

      const drawFrame = (img) => {
        const w = canvas.width, h = canvas.height
        const iAspect = img.naturalWidth / img.naturalHeight
        const cAspect = w / h
        let sx, sy, sw, sh
        if (cAspect > iAspect) {
          sw = img.naturalWidth;  sh = sw / cAspect
          sx = 0;                 sy = (img.naturalHeight - sh) / 2
        } else {
          sh = img.naturalHeight; sw = sh * cAspect
          sx = (img.naturalWidth - sw) / 2; sy = 0
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
      }

      const showFrame = (index) => {
        if (index === currentIndex) return
        currentIndex = index
        const img = images[index]
        if (img.complete) drawFrame(img)
        else img.onload = () => drawFrame(img)
      }

      const onScroll = () => showFrame(getFrameIndex())
      window.addEventListener('scroll', onScroll, { passive: true })

      playIntro(showFrame, () => {
        showFrame(getFrameIndex())
      }, () => cancelled)

      return () => {
        cancelled = true
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', setSize)
      }
    }

    /* Desktop: Three.js shader met image sequence */
    const canvas = canvasRef.current
    let cancelled = false
    let dispose   = null

    import('three').then((THREE) => {
      if (cancelled) return

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

      const scene    = new THREE.Scene()
      const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const geo      = new THREE.PlaneGeometry(2, 2)
      const resolution = new THREE.Vector2()
      const imageSize  = new THREE.Vector2(1920, 1080)

      const texture = new THREE.Texture()
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter

      let currentIndex = -1
      const showFrame = (index) => {
        if (index === currentIndex) return
        currentIndex = index
        const img = images[index]
        const apply = () => {
          imageSize.set(img.naturalWidth, img.naturalHeight)
          texture.image = img
          texture.needsUpdate = true
        }
        if (img.complete) apply()
        else img.onload = apply
      }

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

      let targetStrength = 0, currentStrength = 0
      const targetMouse = new THREE.Vector2(0.5, 0.5)
      let rafId = null, idleTimer = null

      const tick = (t) => {
        if (cancelled) return
        uniforms.uTime.value     = t * 0.001
        currentStrength         += (targetStrength - currentStrength) * 0.05
        uniforms.uStrength.value = currentStrength
        uniforms.uMouse.value.lerp(targetMouse, 0.08)
        renderer.render(scene, camera)
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)

      const onScroll = () => showFrame(getFrameIndex())
      window.addEventListener('scroll', onScroll, { passive: true })

      playIntro(showFrame, () => {
        showFrame(getFrameIndex())
      }, () => cancelled)

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
        window.removeEventListener('scroll', onScroll)
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
    }
  }, [])

  return (
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
  )
}

export default HeroDistortion
