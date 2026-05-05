'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_ACTIONS = [
  { icon: '🍽️', label: 'Plan de hoy', prompt: 'Hazme un plan de comidas completo para hoy, con cantidades y horarios exactos.' },
  { icon: '💪', label: 'Rutina semanal', prompt: 'Dame una rutina de entrenamiento de 3 días para definición corporal, adaptada a mi perfil.' },
  { icon: '🔥', label: 'Ajustar calorías', prompt: 'Ajusta mi plan calórico para optimizar la pérdida de grasa manteniendo la masa muscular.' },
  { icon: '⚡', label: 'Consejo rápido', prompt: 'Dame un consejo práctico y accionable para hoy sobre nutrición o entrenamiento.' },
]

const CHECKLIST_ITEMS = [
  { id: 'training', label: '🏋️ Entrenamiento completado' },
  { id: 'water', label: '💧 Hidratación (2L de agua)' },
  { id: 'meals', label: '🍽️ 3 comidas estructuradas' },
  { id: 'no_snacking', label: '🚫 Sin picoteo entre comidas' },
  { id: 'sleep', label: '😴 Dormí 7-8 horas' },
  { id: 'steps', label: '👟 10,000 pasos' },
  { id: 'light_dinner', label: '🥗 Cena ligera' },
]

function formatMessage(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const lines = html.split('\n')
  const result: string[] = []
  let inList = false

  for (const line of lines) {
    if (/^[-•✓✗*] /.test(line)) {
      if (!inList) { result.push('<ul>'); inList = true }
      result.push(`<li>${line.replace(/^[-•✓✗*] /, '')}</li>`)
    } else {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(line)
    }
  }
  if (inList) result.push('</ul>')
  html = result.join('\n')

  return html
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+?)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\n/g, '<br/>')
}

export default function NutriCoach() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('nutricoach-checklist')
    if (saved) {
      try { setChecklist(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: content.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) throw new Error('Error en la respuesta del servidor')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
          return updated
        })
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, hubo un error al conectar. Verificá tu conexión e intentá de nuevo.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const toggleChecklist = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] }
    setChecklist(updated)
    localStorage.setItem('nutricoach-checklist', JSON.stringify(updated))
  }

  const resetChecklist = () => {
    setChecklist({})
    localStorage.removeItem('nutricoach-checklist')
  }

  const completedCount = CHECKLIST_ITEMS.filter(item => checklist[item.id]).length
  const progressPct = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100)

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-logo">🥗</div>
        <div className="header-info">
          <div className="header-title">NutriCoach AI</div>
          <div className="header-subtitle">Tu nutricionista personal — Alan Bonavita</div>
        </div>
        <div className="header-badge">Claude AI</div>
      </header>

      <div className="main">
        {/* Sidebar */}
        <aside className="sidebar">
          {/* Quick Actions */}
          <div>
            <div className="sidebar-section-title">Acciones rápidas</div>
            <div className="quick-actions">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.label}
                  className="quick-action-btn"
                  onClick={() => sendMessage(action.prompt)}
                  disabled={isLoading}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Checklist */}
          <div>
            <div className="sidebar-section-title">Checklist del día</div>

            <div className="progress-wrap">
              <div className="progress-text">
                <span>{completedCount}/{CHECKLIST_ITEMS.length} completados</span>
                <span>{progressPct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="checklist" style={{ marginTop: '12px' }}>
              {CHECKLIST_ITEMS.map(item => (
                <label
                  key={item.id}
                  className={`checklist-item${checklist[item.id] ? ' checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={() => toggleChecklist(item.id)}
                  />
                  <span className="checklist-label">{item.label}</span>
                </label>
              ))}
            </div>

            <button className="reset-btn" onClick={resetChecklist}>
              Reiniciar checklist
            </button>
          </div>
        </aside>

        {/* Chat Window */}
        <div className="chat-window">
          <div className="messages">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-icon">🥗</div>
                <h2>Hola Alan, soy tu NutriCoach</h2>
                <p>
                  Estoy listo para ayudarte con tu plan de definición corporal.
                  Usá las acciones rápidas o escribime lo que necesités.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <div className="message-role">
                    {msg.role === 'user' ? 'Vos' : 'NutriCoach'}
                  </div>
                  <div className="bubble">
                    {msg.role === 'assistant' ? (
                      msg.content === '' && isLoading && i === messages.length - 1 ? (
                        <div className="typing">
                          <span /><span /><span />
                        </div>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-row">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Consultame sobre nutrición, entrenamiento o tu plan del día..."
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                aria-label="Enviar"
              >
                ➤
              </button>
            </div>
            <div className="input-hint">Enter para enviar · Shift+Enter para nueva línea</div>
          </div>
        </div>
      </div>
    </div>
  )
}
