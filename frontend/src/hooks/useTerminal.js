import { useEffect, useRef, useCallback } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

const useTerminal = (containerRef, onData) => {
  const terminalRef = useRef(null)
  const fitAddonRef = useRef(null)

  // Initialize xterm.js
  useEffect(() => {
    if (!containerRef.current) return

    // Create terminal instance
    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#f1f1f1',
        cursor: '#f1f1f1',
        black: '#000000',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#e5c07b',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#abb2bf',
        brightBlack: '#5c6370',
        brightRed: '#e06c75',
        brightGreen: '#98c379',
        brightYellow: '#e5c07b',
        brightBlue: '#61afef',
        brightMagenta: '#c678dd',
        brightCyan: '#56b6c2',
        brightWhite: '#ffffff',
      },
      scrollback: 1000,
      allowTransparency: false,
    })

    // Create fit addon — auto resize terminal to container
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)

    // Mount terminal to DOM
    terminal.open(containerRef.current)

    // Fit to container size
    setTimeout(() => fitAddon.fit(), 100)

    // When user types — call onData callback
    terminal.onData((data) => {
      if (onData) onData(data)
    })

    // Store refs
    terminalRef.current = terminal
    fitAddonRef.current = fitAddon

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [containerRef])

  // Write data to terminal (display output)
  const writeToTerminal = useCallback((data) => {
    if (terminalRef.current) {
      terminalRef.current.write(data)
    }
  }, [])

  // Get terminal dimensions
  const getDimensions = useCallback(() => {
    if (terminalRef.current) {
      return {
        cols: terminalRef.current.cols,
        rows: terminalRef.current.rows,
      }
    }
    return { cols: 80, rows: 24 }
  }, [])

  // Focus terminal
  const focusTerminal = useCallback(() => {
    terminalRef.current?.focus()
  }, [])

  // Clear terminal
  const clearTerminal = useCallback(() => {
    terminalRef.current?.clear()
  }, [])

  return {
    terminal: terminalRef.current,
    writeToTerminal,
    getDimensions,
    focusTerminal,
    clearTerminal,
  }
}

export default useTerminal