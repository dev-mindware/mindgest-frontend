"use client"
import RegisterIllustration from '@/assets/RegisterIllustration.svg'
import { Button, Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTrigger } from "@/components"
import Image from "next/image"
import { FirstStep, SecondStep, ThirdStep, FourthStep } from "./steps"
import { useState } from "react"

const steps = [1, 2, 3, 4]


export default function Page() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleNextStep = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
      setIsLoading(false)
    }, 1000)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  
  const renderCurrentForm = () => {
    switch(currentStep) {
      case 1:
        return <FirstStep />
      case 2:
        return <SecondStep />
      case 3:
        return <ThirdStep />
      case 4:
        return <FourthStep />
      default:
        return <FirstStep />
    }
  }
  
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <div className="items-center justify-center hidden h-screen md:flex lg:flex">
        <Image
          src={RegisterIllustration}
          alt="Image"
          width={800}
        />
      </div>

      <div className="absolute top-1/2 z-10 hidden w-px h-[75%] -translate-y-1/2 lg:block left-1/2 -translate-x-1/2 bg-border" />

      <div className="relative z-20 flex flex-col p-6 md:p-10">
  <div className="max-w-xl mx-auto space-y-8 text-center md:w-[25rem] w-50">
    <Stepper value={currentStep} onValueChange={setCurrentStep}>
      {steps.map((step) => (
        <StepperItem
          key={step}
          step={step}
          className="not-last:flex-1"
          loading={isLoading}
        >
          <StepperTrigger asChild>
            <StepperIndicator />
          </StepperTrigger>
          {step < steps.length && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
    <p
      className="mt-2 text-xs text-muted-foreground"
      role="region"
      aria-live="polite"
    >
      Passo {currentStep} de {steps.length}
    </p>
  </div>
  
  <div className="flex items-center justify-center flex-1">
    <div className="w-full max-w-md">
      {renderCurrentForm()}
    </div>
  </div>
  
  <div className="flex items-center justify-center gap-5 mt-5 md:justify-end">
    <Button
      variant="outline"
      className="w-32 dark:bg-yellow-500"
      onClick={handlePrevStep}
      disabled={currentStep === 1}
    >
      Anterior
    </Button>
    <Button
      variant="outline"
      className="w-32"
      onClick={handleNextStep}
      disabled={currentStep >= steps.length}
    >
      {currentStep === steps.length ? 'Finalizar' : 'Próximo'}
    </Button>
  </div>
</div>
    </div>
  )
}