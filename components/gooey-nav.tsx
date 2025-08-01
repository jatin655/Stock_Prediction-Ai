"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface NavItem {
  label: string
  href: string
}

interface GooeyNavProps {
  items: NavItem[]
  animationTime?: number
  particleCount?: number
  particleDistances?: [number, number]
  particleR?: number
  timeVariance?: number
  colors?: number[]
  initialActiveIndex?: number
}

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}: GooeyNavProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const filterRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)

  const noise = (n = 1) => n / 2 - Math.random() * n

  const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
    return [distance * Math.cos(angle), distance * Math.sin(angle)]
  }

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10)
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    }
  }

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances
    const r = particleR
    const bubbleTime = animationTime * 2 + timeVariance
    element.style.setProperty("--time", `${bubbleTime}ms`)

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2)
      const p = createParticle(i, t, d, r)
      element.classList.remove("active")

      setTimeout(() => {
        const particle = document.createElement("span")
        const point = document.createElement("span")
        particle.classList.add("particle")
        particle.style.setProperty("--start-x", `${p.start[0]}px`)
        particle.style.setProperty("--start-y", `${p.start[1]}px`)
        particle.style.setProperty("--end-x", `${p.end[0]}px`)
        particle.style.setProperty("--end-y", `${p.end[1]}px`)
        particle.style.setProperty("--time", `${p.time}ms`)
        particle.style.setProperty("--scale", `${p.scale}`)
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`)
        particle.style.setProperty("--rotate", `${p.rotate}deg`)

        point.classList.add("point")
        particle.appendChild(point)
        element.appendChild(particle)

        requestAnimationFrame(() => {
          element.classList.add("active")
        })

        setTimeout(() => {
          try {
            element.removeChild(particle)
          } catch {
            // do nothing
          }
        }, t)
      }, 30)
    }
  }

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const pos = element.getBoundingClientRect()

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    }

    Object.assign(filterRef.current.style, styles)
    Object.assign(textRef.current.style, styles)
    textRef.current.innerText = element.innerText
  }

  const router = useRouter()

  // Smoothly change the active pill and navigate.
  const handleClick = (href: string, index: number, liEl: HTMLElement) => {
    if (activeIndex === index) return

    setActiveIndex(index)
    updateEffectPosition(liEl)

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".particle")
      particles.forEach((p) => filterRef.current!.removeChild(p))
    }

    if (textRef.current) {
      textRef.current.classList.remove("active")
      void textRef.current.offsetWidth
      textRef.current.classList.add("active")
    }

    if (filterRef.current) {
      makeParticles(filterRef.current)
    }

    // Wait for the animation to finish, then navigate.
    setTimeout(() => router.push(href), 300)
  }

  // Keyboard accessibility helper.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, href: string, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const liEl = (e.currentTarget.parentElement || undefined) as HTMLElement
      if (liEl) handleClick(href, index, liEl)
    }
  }

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return

    const activeLi = navRef.current.querySelectorAll("li")[activeIndex] as HTMLElement
    if (activeLi) {
      updateEffectPosition(activeLi)
      textRef.current?.classList.add("active")
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll("li")[activeIndex] as HTMLElement
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi)
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [activeIndex])

  return (
    <>
      {/* This effect is quite difficult to recreate faithfully using Tailwind, so a style tag is a necessary workaround */}
      <style>
        {`
          :root {
            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
            --color-1: #0ea5e9;
            --color-2: #0284c7;
            --color-3: #0369a1;
            --color-4: #075985;
          }
          .gooey-nav .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .gooey-nav .effect.text {
            color: white;
            transition: color 0.3s ease;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }
          .gooey-nav .effect.text.active {
            color: #0f172a;
          }
          .gooey-nav .effect.filter {
            filter: blur(7px) contrast(100) blur(0);
            mix-blend-mode: lighten;
          }
          .gooey-nav .effect.filter::before {
            content: "";
            position: absolute;
            inset: -75px;
            z-index: -2;
            background: black;
          }
          .gooey-nav .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
            box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
          }
          .gooey-nav .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .gooey-nav .particle,
          .gooey-nav .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .gooey-nav .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 8px);
            left: calc(50% - 8px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .gooey-nav .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          .gooey-nav li.active {
            color: #0f172a;
            text-shadow: none;
          }
          .gooey-nav li.active::after {
            opacity: 1;
            transform: scale(1);
          }
          .gooey-nav li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 8px;
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
            box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
          }
        `}
      </style>
      <div className="gooey-nav relative" ref={containerRef}>
        <nav className="flex relative" style={{ transform: "translate3d(0,0,0.01px)" }}>
          <ul
            ref={navRef}
            className="flex gap-8 list-none p-0 px-4 m-0 relative z-[3]"
            style={{
              color: "white",
              textShadow: "0 1px 1px hsl(205deg 30% 10% / 0.2)",
            }}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`rounded-full relative cursor-pointer transition-[background-color_color_box-shadow] duration-300 ease shadow-[0_0_0.5px_1.5px_transparent] text-white ${
                  activeIndex === index ? "active" : ""
                }`}
              >
                <a
                  onClick={(e) => {
                    e.preventDefault()
                    const liEl = e.currentTarget.parentElement as HTMLElement
                    handleClick(item.href, index, liEl)
                  }}
                  href={item.href}
                  onKeyDown={(e) => handleKeyDown(e, item.href, index)}
                  className="outline-none py-[0.6em] px-[1em] inline-block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  )
}

export default GooeyNav
