import { Button } from "@/components/ui";
import ProductCards from "../product-cards";
import Image from 'next/image'
import Ai from '@/assets/ai.gif'
export function Management() {
  return( 
  <div>
    <div className="flex items-center justify-between w-full">
        <div>        
            <h1 className="text-2xl font-semibold">Produtos</h1>
            <p className="text-muted-foreground">Faça a gestão dos seus produtos aqui</p>
        </div>
        <Button>Novo Produto</Button>
    </div>
    <div className="flex items-center justify-center p-4">
        <Image src={Ai} alt="Image" width={100}/>
    </div>
    <ProductCards className='lg:grid-cols-3'/>
    </div>
  )
}