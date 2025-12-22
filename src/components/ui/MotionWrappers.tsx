"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// ----------------------------------------------------------------------
// 1. HoverScale: Escala elástica para botones y tarjetas
// ----------------------------------------------------------------------
interface HoverScaleProps {
    children: ReactNode;
    scaleHover?: number;
    scaleTap?: number;
    className?: string; // Permite pasar clases CSS adicionales
    style?: React.CSSProperties;
}

export const HoverScale = ({
    children,
    scaleHover = 1.05,
    scaleTap = 0.95,
    className,
    style
}: HoverScaleProps) => {
    return (
        <motion.div
            className={className}
            style={style}
            whileHover={{ scale: scaleHover }}
            whileTap={{ scale: scaleTap }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
};

// ----------------------------------------------------------------------
// 2. ActionIconMotion: Rotación y rebote para iconos de acción
// ----------------------------------------------------------------------
interface ActionIconMotionProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export const ActionIconMotion = ({ children, onClick, className }: ActionIconMotionProps) => {
    return (
        <motion.div
            className={className}
            onClick={onClick}
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            style={{ display: 'inline-flex', cursor: 'pointer' }}
        >
            {children}
        </motion.div>
    );
};

// ----------------------------------------------------------------------
// 3. MagicTab: Fondo animado para pestañas (Layout Id)
// ----------------------------------------------------------------------
// Este componente se usa *detrás* del texto de la pestaña activa.
// El contenedor padre debe tener `layoutId` compartido si se usa AnimatePresence,
// pero para pestañas simples basta con renderizarlo condicionalmente.

export const MagicTabBackground = () => {
    return (
        <motion.div
            layoutId="activeTabBackground"
            style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "var(--color-primary-soft)", // O la variable que corresponda
                borderRadius: "var(--mantine-radius-md)",
                zIndex: -1, // Detrás del texto
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
    );
};
