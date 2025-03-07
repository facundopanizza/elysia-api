import 'dotenv/config';
import { createFileRoute } from '@tanstack/react-router'
import { api } from 'libs'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
    </div>
  )
}
