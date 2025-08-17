import { ProductList } from '@/components'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div>
      <Link href="/client/documents/new">
        Novo
      </Link>
      <ProductList/>
    </div>
  )
}
