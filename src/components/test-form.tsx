import React from 'react'
import { TsunamiOnly, SmartProOnly, BaseOnly } from './plan-wrapper'
import { Input, Button } from './ui'
import { useModal } from '@/stores';
import { AddProduct } from './templates';

export default function TestForm() {
  const { openModal } = useModal();
  return (
    <div>
      <BaseOnly>
        <p>Visível apenas para BASE</p>
      </BaseOnly>
      <TsunamiOnly>
        <p>Visível apenas para TSUNAMI</p>
      </TsunamiOnly>
      <SmartProOnly>
        <p>Visível apenas para SMART_PRO</p>
      </SmartProOnly>
      <Button
        onClick={() => openModal("add-product")}
      >
        Novo Produto
      </Button>
      <AddProduct />
      <div className='w-[25rem]'>
        <div className='w-full'>
          <Input label="Quantidade" type="text"/>
        </div>
      </div>

    </div>
  )
}
