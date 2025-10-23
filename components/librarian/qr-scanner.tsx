 'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QRScannerProps {
  onScan: (data: string) => void
  title?: string
}

export function QRScanner({ onScan, title = 'QR Scanner' }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  // will hold the Html5QrcodeScanner instance once dynamically imported and created
  const scannerRef = useRef<unknown | null>(null)
  const moduleRef = useRef<unknown | null>(null)

  // minimal typing for dynamic import to avoid `any`
  type Html5QrcodeScannerConstructor = new (
    elementId: string,
    config: { fps: number; qrbox: { width: number; height: number } },
    verbose?: boolean
  ) => {
    render: (onSuccess: (d: string) => void, onError?: (e: unknown) => void) => void
    clear?: () => void
  }

  useEffect(() => {
    let mounted = true

    async function initScanner() {
      try {
        // dynamic import to keep library out of main bundle
        if (!moduleRef.current) {
          moduleRef.current = await import('html5-qrcode')
        }

  const mod = moduleRef.current as { Html5QrcodeScanner?: Html5QrcodeScannerConstructor }

        if (!mounted) return

        const Html5QrcodeScanner = mod?.Html5QrcodeScanner

        if (!Html5QrcodeScanner) {
          console.error('Html5QrcodeScanner not found on module')
          return
        }

        // create scanner instance
        scannerRef.current = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          false
        )

        const scannerInstance = scannerRef.current as { render: (onSuccess: (d: string) => void, onError?: (e: unknown) => void) => void }

        scannerInstance.render(
          (decodedText: string) => {
            onScan(decodedText)
            stopScanning()
          },
          (error: unknown) => {
            console.warn('QR scan error:', error)
          }
        )
      } catch (err) {
        console.error('Failed to load QR scanner lib', err)
      }
    }

    if (isScanning) {
      initScanner()
    }

    return () => {
      mounted = false
      if (scannerRef.current) {
        const inst = scannerRef.current as { clear?: () => void }
        try {
          inst.clear?.()
        } catch {}
        scannerRef.current = null
      }
    }
  }, [isScanning, onScan])

  const startScanning = () => {
    setIsScanning(true)
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      const inst = scannerRef.current as { clear?: () => void }
      try {
        inst.clear?.()
      } catch {}
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  return (
    <Card className="shadow-lg rounded-md p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full bg-zinc-800 text-white">
            Start QR Scan
          </Button>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full"></div>
            <Button onClick={stopScanning} variant="outline" className="w-full bg-zinc-800 text-white">
              Stop Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
