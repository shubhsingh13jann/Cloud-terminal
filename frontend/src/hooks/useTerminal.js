import { useEffect, useRef, useCallback } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { SearchAddon } from '@xterm/addon-search'
import '@xterm/xterm/css/xterm.css'

const useTerminal = (containerRef, onData, onResize) => {
  const terminalRef = useRef(null)
  const fitAddonRef = useRef(null)
  const searchAddonRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Courier New, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#f1f1f1',
        cursor: '#f1f1f1',
        selectionBackground: '#264f78',
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
      convertEol: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    const searchAddon = new SearchAddon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)
    terminal.loadAddon(searchAddon)

    terminal.open(containerRef.current)

    // Initial fit
    setTimeout(() => {
      fitAddon.fit()
      // Notify parent of initial dimensions
      if (onResize) {
        onResize({
          cols: terminal.cols,
          rows: terminal.rows,
        })
      }
    }, 100)

    // User input handler
    terminal.onData((data) => {
      if (onData) onData(data)
    })

    // Resize handler — fires when terminal dimensions change
    terminal.onResize(({ cols, rows }) => {
      if (onResize) onResize({ cols, rows })
    })

    terminalRef.current = terminal
    fitAddonRef.current = fitAddon
    searchAddonRef.current = searchAddon

    // Window resize → fit terminal
    const handleWindowResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      terminal.dispose()
    }
  }, [containerRef])

  const writeToTerminal = useCallback((data) => {
    terminalRef.current?.write(data)
  }, [])

  const getDimensions = useCallback(() => ({
    cols: terminalRef.current?.cols || 80,
    rows: terminalRef.current?.rows || 24,
  }), [])

  const focusTerminal = useCallback(() => {
    terminalRef.current?.focus()
  }, [])

  const clearTerminal = useCallback(() => {
    terminalRef.current?.clear()
  }, [])

  const fitTerminal = useCallback(() => {
    fitAddonRef.current?.fit()
  }, [])

  const searchInTerminal = useCallback((term) => {
    searchAddonRef.current?.findNext(term)
  }, [])

  const changeFontSize = useCallback((size) => {
    if (terminalRef.current) {
      terminalRef.current.options.fontSize = size
      fitAddonRef.current?.fit()
    }
  }, [])

  return {
    terminal: terminalRef.current,
    writeToTerminal,
    getDimensions,
    focusTerminal,
    clearTerminal,
    fitTerminal,
    searchInTerminal,
    changeFontSize,
  }
}

export default useTerminal