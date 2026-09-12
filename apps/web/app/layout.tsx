import './globals.css'; import type { Metadata } from 'next';
export const metadata:Metadata={title:'interactive-archify',description:'Architecture that explains itself.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
