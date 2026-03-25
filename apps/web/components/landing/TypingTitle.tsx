'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

export function TypingTitle({ 
  children, 
  className, 
  delay = 0,
  speed = 40,
  style
}: { 
  children: string; 
  className?: string; 
  delay?: number;
  speed?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const hasTyped = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTyped.current) {
          hasTyped.current = true
          // Convert string <br /> to actual \n for split
          const text = children.replace(/<br\s*\/?>/g, '\n')
          el.innerHTML = ''
          
          const chars = text.split('')
          
          chars.forEach((ch, i) => {
            if (ch === '\n') {
              el.appendChild(document.createElement('br'))
              return
            }
            const span = document.createElement('span')
            span.className = 'typed-char'
            span.textContent = ch === ' ' ? '\u00A0' : ch
            el.appendChild(span)
            setTimeout(() => {
              span.classList.add('on')
              setTimeout(() => span.classList.add('dim'), 800)
            }, delay + i * speed)
          })
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [children, delay, speed])

  return <h2 ref={ref} className={className} style={style}>{children}</h2>
}
