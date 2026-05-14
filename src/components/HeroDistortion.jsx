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

  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float     uBlend;
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

    vec2 uv     = coverUv(vUv + offset);
    vec4 colorA = texture2D(uTexA, uv);
    vec4 colorB = texture2D(uTexB, uv);
    gl_FragColor = mix(colorA, colorB, uBlend);
  }
`

const frameModules = import.meta.glob('../assets/hero-frames/*.jpg', { eager: true })
const FRAME_URLS = Object.keys(frameModules).sort().map(k => frameModules[k].default)

const INTRO_END      = 19
const INTRO_DURATION = 2000

function HeroDistortion({ onFramesReady, playing }) {
  const canvasRef    = useRef(null)
  const playingRef   = useRef(playing)
  const startFnRef   = useRef(null)
  const framesReady  = useRef(false)
  const isTouch = window.matchMedia('(pointer: coarse)').matches

  /* Wanneer playing true wordt: start intro als alles klaar is */
  useEffect(() => {
    playingRef.current = playing
    if (playing && framesReady.current && startFnRef.current) {
      startFnRef.current()
      startFnRef.current = null
    }
  }, [playing])

  useEffect(() => {
    const images = FRAME_URLS.map(url => {
      const img = new Image()
      img.src = url
      return img
    })

    let introComplete = false

    const getFrameIndex = () => {
      if (!introComplete) return INTRO_END
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return INTRO_END
      const scrollable = images.length - 1 - INTRO_END
      return INTRO_END + Math.round(Math.min(window.scrollY / max, 1) * scrollable)
    }

    const playIntro = (showBlendedFn, onDone, isCancelled) => {
      let startTime = null
      const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      const step = t => {
        if (isCancelled()) return
        if (startTime === null) startTime = t
        const progress = Math.min((t - startTime) / INTRO_DURATION, 1)
        showBlendedFn(ease(progress) * INTRO_END)
        if (progress >= 1) {
          introComplete = true
          onDone?.()
          return
        }
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    /* Wacht tot frames 0–INTRO_END geladen zijn; start daarna als playing=true */
    const onIntroFramesLoaded = () => {
      framesReady.current = true
      onFramesReady?.()
      if (playingRef.current && startFnRef.current) {
        startFnRef.current()
        startFnRef.current = null
      }
    }

    const introFrames = images.slice(0, INTRO_END + 1)
    let loadedCount = 0
    introFrames.forEach(img => {
      const check = () => {
        loadedCount++
        if (loadedCount === introFrames.length) onIntroFramesLoaded()
      }
      if (img.complete) check()
      else img.addEventListener('load', check, { once: true })
    })

    /* ── Touch: Canvas 2D ── */
    if (isTouch) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
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

      let currentIndex = -1
      const showFrame = (index) => {
        if (index === currentIndex) return
        currentIndex = index
        const img = images[index]
        if (img.complete) drawFrame(img)
        else img.onload = () => drawFrame(img)
      }

      const showFrameBlended = (floatIndex) => {
        const iA = Math.floor(floatIndex)
        const iB = Math.min(iA + 1, images.length - 1)
        const blend = floatIndex - iA
        const imgA = images[iA]
        const imgB = images[iB]
        const draw = () => {
          if (!imgA.complete) return
          drawFrame(imgA)
          if (blend > 0.01 && imgB.complete) {
            ctx.save()
            ctx.globalAlpha = blend
            drawFrame(imgB)
            ctx.restore()
          }
        }
        imgA.complete && imgB.complete ? draw() : (imgA.onload = imgB.onload = draw)
      }

      const onScroll = () => showFrame(getFrameIndex())
      window.addEventListener('scroll', onScroll, { passive: true })

      startFnRef.current = () =>
        playIntro(showFrameBlended, () => showFrame(getFrameIndex()), () => cancelled)

      if (framesReady.current && playingRef.current) {
        startFnRef.current()
        startFnRef.current = null
      }

      return () => {
        cancelled = true
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', setSize)
      }
    }

    /* ── Desktop: Three.js shader ── */
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

      const makeTexture = () => {
        const t = new THREE.Texture()
        t.minFilter = THREE.LinearFilter
        t.magFilter = THREE.LinearFilter
        return t
      }
      const texA = makeTexture()
      const texB = makeTexture()

      let currentIndex = -1
      const showFrame = (index) => {
        if (index === currentIndex) return
        currentIndex = index
        const img = images[index]
        const apply = () => {
          imageSize.set(img.naturalWidth, img.naturalHeight)
          texA.image = img; texA.needsUpdate = true
          texB.image = img; texB.needsUpdate = true
          uniforms.uBlend.value = 0
        }
        if (img.complete) apply(); else img.onload = apply
      }

      let lastFloor = -1, lastCeil = -1
      const showFrameBlended = (floatIndex) => {
        const iA = Math.floor(floatIndex)
        const iB = Math.min(iA + 1, images.length - 1)
        if (iA !== lastFloor) {
          lastFloor = iA
          const img = images[iA]
          const apply = () => {
            imageSize.set(img.naturalWidth, img.naturalHeight)
            texA.image = img; texA.needsUpdate = true
          }
          if (img.complete) apply(); else img.onload = apply
        }
        if (iB !== lastCeil) {
          lastCeil = iB
          const img = images[iB]
          const apply = () => { texB.image = img; texB.needsUpdate = true }
          if (img.complete) apply(); else img.onload = apply
        }
        uniforms.uBlend.value = floatIndex - iA
      }

      const uniforms = {
        uTexA:       { value: texA },
        uTexB:       { value: texB },
        uBlend:      { value: 0 },
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

      const tick = t => {
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

      startFnRef.current = () =>
        playIntro(showFrameBlended, () => showFrame(getFrameIndex()), () => cancelled)

      if (framesReady.current && playingRef.current) {
        startFnRef.current()
        startFnRef.current = null
      }

      const onMouseMove = e => {
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
        texA.dispose(); texB.dispose()
        renderer.dispose(); mat.dispose(); geo.dispose()
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
