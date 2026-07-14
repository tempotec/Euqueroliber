import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type AnimatedTitleProps = {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
}

export function AnimatedTitle({ as = 'h2', children, className }: AnimatedTitleProps) {
  const Component = motion[as]
  const shouldReduceMotion = useReducedMotion()

  return (
    <Component
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`text-balance ${className ?? ''}`}
    >
      {children}
    </Component>
  )
}
