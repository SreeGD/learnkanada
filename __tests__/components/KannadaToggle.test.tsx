import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import KannadaToggle from '@/components/KannadaToggle'

describe('KannadaToggle', () => {
  it('renders toggle button when script is provided', () => {
    render(<KannadaToggle script="ನಮಸ್ಕಾರ" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders nothing when script is empty', () => {
    const { container } = render(<KannadaToggle script="" />)
    expect(container.firstChild).toBeNull()
  })

  it('shows kannada script text after clicking toggle', () => {
    render(<KannadaToggle script="ನಮಸ್ಕಾರ" />)
    expect(screen.queryByText('ನಮಸ್ಕಾರ')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('ನಮಸ್ಕಾರ')).toBeInTheDocument()
  })

  it('hides kannada script text on second click', () => {
    render(<KannadaToggle script="ನಮಸ್ಕಾರ" />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByText('ನಮಸ್ಕಾರ')).not.toBeInTheDocument()
  })
})
