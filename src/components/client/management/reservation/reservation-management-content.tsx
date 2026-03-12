import { TitleList } from '@/components/common'
import { ReservationsView } from './comps'


export function ReservationManagementContent() {
  return (
    <div className='space-y-6'>
        <TitleList title="Gestão de Reservas" suTitle='Gerencie as suas reservas aqui através do calendário'/>
        <ReservationsView/>
    </div>
  )
}