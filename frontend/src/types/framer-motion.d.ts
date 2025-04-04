declare module 'framer-motion' {
  import * as React from 'react';

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    className?: string;
    style?: React.CSSProperties;
    variants?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface MotionValue<T = number> {
    get(): T;
    set(value: T): void;
    onChange(callback: (value: T) => void): () => void;
  }

  export interface AnimationControls {
    start(definition: any, options?: any): Promise<any>;
    stop(): void;
  }

  export function useMotionValue<T = number>(initial: T): MotionValue<T>;
  export function useTransform<T>(value: MotionValue, inputRange: number[], outputRange: T[]): MotionValue<T>;
  export function useAnimationControls(): AnimationControls;
  export function useAnimation(): AnimationControls;
  
  export interface ScrollProps {
    target?: React.RefObject<HTMLElement>;
    offset?: string[] | number[];
    container?: React.RefObject<HTMLElement>;
  }
  
  export function useScroll(props?: ScrollProps): {
    scrollX: MotionValue<number>;
    scrollY: MotionValue<number>;
    scrollXProgress: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
  };

  export function useMotionValueEvent<T>(value: MotionValue<T>, event: string, callback: (value: T) => void): void;

  type MotionComponent<T extends React.ElementType> = React.ForwardRefExoticComponent<
    MotionProps & React.ComponentPropsWithoutRef<T> & React.RefAttributes<Element>
  >;

  export interface Motion {
    div: MotionComponent<'div'>;
    span: MotionComponent<'span'>;
    button: MotionComponent<'button'>;
    a: MotionComponent<'a'>;
    ul: MotionComponent<'ul'>;
    ol: MotionComponent<'ol'>;
    li: MotionComponent<'li'>;
    p: MotionComponent<'p'>;
    h1: MotionComponent<'h1'>;
    h2: MotionComponent<'h2'>;
    h3: MotionComponent<'h3'>;
    h4: MotionComponent<'h4'>;
    h5: MotionComponent<'h5'>;
    h6: MotionComponent<'h6'>;
    img: MotionComponent<'img'>;
    svg: MotionComponent<'svg'>;
    path: MotionComponent<'path'>;
    circle: MotionComponent<'circle'>;
    [key: string]: any;
  }

  export const motion: Motion;
} 