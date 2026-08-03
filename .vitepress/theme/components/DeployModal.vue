<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

// ── State ─────────────────────────────────────────────────────────────────────
const open = ref(false)
const step = ref(1)
const TOTAL_STEPS = 4

// Step 1 — Project
const projectName = ref('my-kyro-app')
const template = ref('minimal')
const database = ref('sqlite')

// Step 2 — Account
const adminEmail = ref('')
const adminPasswordMode = ref('auto')
const adminPasswordCustom = ref('')

// Step 3 — Cloudflare
const authMode = ref('oauth') // 'oauth' | 'token'
const cfToken = ref('')
const cfUserEmail = ref('')
const showToken = ref(false)
const advancedOpen = ref(false)
const workerName = ref('')
const r2Bucket = ref('')
const pgUrl = ref('')
const hyperdriveName = ref('')

function openCloudflareOAuth() {
  const serverUrl = import.meta.env.VITE_DEPLOY_SERVER_URL || 'http://localhost:3099'
  const width = 600
  const height = 700
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2
  
  window.open(
    `${serverUrl}/api/auth/cloudflare`,
    'Cloudflare OAuth',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  )
}

function onWindowMessage(event) {
  if (event.data && event.data.type === 'cf-auth-success') {
    cfToken.value = event.data.token
    cfUserEmail.value = event.data.email
    authMode.value = 'oauth'
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('message', onWindowMessage)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('message', onWindowMessage)
})

// Step 4 — Deploy
const logLines = ref([])
const activeStatus = ref('Starting deployment…')
const deploying = ref(false)
const done = ref(false)
const error = ref(null)

// Done state
const liveUrl = ref('')
const resultAdminEmail = ref('')
const resultAdminPassword = ref('')
const urlCopied = ref(false)
const emailCopied = ref(false)
const passCopied = ref(false)
const showPass = ref(false)

// ── Validation ────────────────────────────────────────────────────────────────
const step1Valid = computed(() => projectName.value.trim().length >= 2)
const step2Valid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail.value))
const step3Valid = computed(() => cfToken.value.trim().length > 0)

const stepValid = computed(() => {
  if (step.value === 1) return step1Valid.value
  if (step.value === 2) return step2Valid.value
  if (step.value === 3) return step3Valid.value
  return true
})

const templates = [
  { id: 'minimal',     label: 'Minimal',    desc: 'One collection, zero config.' },
  { id: 'blog',        label: 'Blog',        desc: 'Posts, categories, media.' },
  { id: 'ecommerce',   label: 'E-commerce',  desc: 'Products, orders, coupons.' },
  { id: 'starter',     label: 'Starter',     desc: 'Pages, posts, menus.' },
  { id: 'kitchen-sink',label: 'Full',        desc: 'Everything included.' },
]

// ── Modal open/close ──────────────────────────────────────────────────────────
function openModal() {
  resetForm()
  open.value = true
  nextTick(() => document.getElementById('deploy-project-name')?.focus())
}

function closeModal() {
  if (deploying.value) return
  open.value = false
}

function resetForm() {
  step.value = 1
  projectName.value = 'my-kyro-app'
  template.value = 'minimal'
  database.value = 'sqlite'
  adminEmail.value = ''
  adminPasswordMode.value = 'auto'
  adminPasswordCustom.value = ''
  cfToken.value = ''
  showToken.value = false
  advancedOpen.value = false
  workerName.value = ''
  r2Bucket.value = ''
  pgUrl.value = ''
  hyperdriveName.value = ''
  logLines.value = []
  activeStatus.value = 'Starting deployment…'
  deploying.value = false
  done.value = false
  error.value = null
  liveUrl.value = ''
  resultAdminEmail.value = ''
  resultAdminPassword.value = ''
  urlCopied.value = false
  emailCopied.value = false
  passCopied.value = false
  showPass.value = false
}

function nextStep() {
  if (!stepValid.value) return
  if (step.value < TOTAL_STEPS) {
    step.value++
    if (step.value === TOTAL_STEPS) {
      startDeploy()
    }
  } else {
    startDeploy()
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}

// ── Keyboard trap ─────────────────────────────────────────────────────────────
function onKeydown(e) {
  if (e.key === 'Escape' && !deploying.value) closeModal()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Lock body scroll when modal is open
watch(open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

// ── Deploy ────────────────────────────────────────────────────────────────────
function addLog(type, message) {
  logLines.value.push({ type, message })
  activeStatus.value = message
  nextTick(() => {
    const el = document.getElementById('deploy-log')
    if (el) el.scrollTop = el.scrollHeight
  })
}

async function startDeploy() {
  step.value = 4
  deploying.value = true
  logLines.value = []
  activeStatus.value = 'Starting deployment…'
  error.value = null

  const payload = {
    projectName: projectName.value.trim(),
    template: template.value,
    database: database.value,
    adminEmail: adminEmail.value.trim(),
    adminPassword: adminPasswordMode.value === 'auto' ? undefined : adminPasswordCustom.value,
    cloudflareApiToken: cfToken.value.trim(),
    workerName: workerName.value.trim() || undefined,
    r2Bucket: r2Bucket.value.trim() || undefined,
    databaseUrl: database.value === 'postgres' ? pgUrl.value.trim() : undefined,
    hyperdriveName: hyperdriveName.value.trim() || undefined,
  }

  try {
    const serverUrl = import.meta.env.VITE_DEPLOY_SERVER_URL || 'http://localhost:3099'
    const res = await fetch(`${serverUrl}/deploy-cloudflare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.body) {
      throw new Error('No response body returned from deploy server')
    }

    console.log('🚀 Starting deploy request to:', `${serverUrl}/deploy-cloudflare`, payload)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done: streamDone, value } = await reader.read()
      if (streamDone) {
        console.log('🏁 Stream completed (done=true)')
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      console.log('📥 Raw stream chunk received:', chunk)
      buffer += chunk

      // SSE messages are separated by \n\n or \n
      const blocks = buffer.split('\n')
      // Keep trailing fragment in buffer
      buffer = blocks.pop() ?? ''

      for (const line of blocks) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(':')) continue // Ignore empty lines or ping comments
        if (!trimmed.startsWith('data:')) continue

        try {
          const jsonStr = trimmed.slice(5).trim()
          const event = JSON.parse(jsonStr)
          console.log('⚡ Parsed Deploy Event:', event)

          if (event.type === 'done') {
            liveUrl.value = event.data?.liveUrl ?? ''
            resultAdminEmail.value = event.data?.adminEmail ?? adminEmail.value
            resultAdminPassword.value = event.data?.adminPassword ?? ''
            done.value = true
            deploying.value = false
            return
          }

          if (event.type === 'error') {
            const msg = typeof event.message === 'string' ? event.message : JSON.stringify(event.message, null, 2)
            error.value = msg
            deploying.value = false
            addLog('error', msg)
            return
          }

          addLog(event.type, event.message)
        } catch (parseErr) {
          console.warn('⚠️ Could not parse SSE event line:', trimmed, parseErr)
        }
      }
    }
  } catch (err) {
    console.error('❌ Deploy Error:', err)
    error.value = err.message ?? 'Unexpected error'
    deploying.value = false
    addLog('error', error.value)
  }
}

// ── Copy helpers ──────────────────────────────────────────────────────────────
function copyText(text, flagRef) {
  navigator.clipboard?.writeText(text).then(() => {
    flagRef.value = true
    setTimeout(() => { flagRef.value = false }, 1800)
  })
}
</script>

<template>
  <!-- ── Trigger Button ─────────────────────────────────────────────────── -->
  <div class="deploy-trigger-wrapper">
    <button class="deploy-trigger" type="button" disabled title="Coming soon — currently in active development">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
      Deploy to Cloudflare
    </button>
    <span class="coming-soon-badge-notif">
      <span class="pulse-dot" />
      COMING SOON
    </span>
  </div>

  <!-- ── Backdrop ───────────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="open" class="dm-backdrop" @click.self="closeModal" aria-hidden="true" />
    </Transition>

    <!-- ── Modal Shell ─────────────────────────────────────────────────── -->
    <Transition name="modal">
      <div v-if="open" class="dm-wrap" role="dialog" aria-modal="true" aria-labelledby="dm-title">
        <div class="dm-card">

          <!-- Header -->
          <div class="dm-header">
            <div class="dm-title-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="dm-cloud-icon">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
              </svg>
              <h2 id="dm-title" class="dm-title">Deploy to Cloudflare</h2>
            </div>
            <button class="dm-close" @click="closeModal" :disabled="deploying" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Step Progress (hide on success) -->
          <div v-if="!done" class="dm-steps" aria-label="Progress">
            <div v-for="s in TOTAL_STEPS" :key="s" class="dm-step-item">
              <div class="dm-step-dot" :class="{ active: step === s, done: step > s }">
                <svg v-if="step > s" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div v-if="s < TOTAL_STEPS" class="dm-step-line" :class="{ done: step > s }" />
            </div>
          </div>

          <!-- ── STEP 1 — Project ─────────────────────────────────────── -->
          <div v-if="step === 1" class="dm-body">
            <div class="dm-section-label">Project</div>

            <label class="dm-label" for="deploy-project-name">Project Name</label>
            <input
              id="deploy-project-name"
              v-model="projectName"
              class="dm-input"
              type="text"
              placeholder="my-kyro-app"
              autocomplete="off"
              spellcheck="false"
            />

            <label class="dm-label">Template</label>
            <div class="dm-template-grid">
              <button
                v-for="t in templates"
                :key="t.id"
                class="dm-template-card"
                :class="{ selected: template === t.id }"
                @click="template = t.id"
                type="button"
              >
                <span class="dm-template-name">{{ t.label }}</span>
                <span class="dm-template-desc">{{ t.desc }}</span>
              </button>
            </div>

            <label class="dm-label">Database</label>
            <div class="dm-toggle-group">
              <button class="dm-toggle" :class="{ active: database === 'sqlite' }" @click="database = 'sqlite'" type="button">SQLite / D1</button>
              <button class="dm-toggle" :class="{ active: database === 'postgres' }" @click="database = 'postgres'" type="button">PostgreSQL</button>
            </div>
          </div>

          <!-- ── STEP 2 — Account ─────────────────────────────────────── -->
          <div v-else-if="step === 2" class="dm-body">
            <div class="dm-section-label">Admin Account</div>

            <label class="dm-label" for="deploy-email">Admin Email</label>
            <input
              id="deploy-email"
              v-model="adminEmail"
              class="dm-input"
              type="email"
              placeholder="admin@myproject.com"
              autocomplete="email"
            />

            <label class="dm-label">Admin Password</label>
            <div class="dm-toggle-group">
              <button class="dm-toggle" :class="{ active: adminPasswordMode === 'auto' }" @click="adminPasswordMode = 'auto'" type="button">Auto-generate</button>
              <button class="dm-toggle" :class="{ active: adminPasswordMode === 'custom' }" @click="adminPasswordMode = 'custom'" type="button">Set manually</button>
            </div>

            <div v-if="adminPasswordMode === 'custom'" style="margin-top: 10px">
              <input
                v-model="adminPasswordCustom"
                class="dm-input"
                type="password"
                placeholder="Enter a strong password"
                autocomplete="new-password"
              />
            </div>

            <p class="dm-hint">Your credentials will be shown once deployment completes.</p>
          </div>

          <!-- ── STEP 3 — Cloudflare ──────────────────────────────────── -->
          <div v-else-if="step === 3" class="dm-body">
            <div class="dm-section-label">Cloudflare Authentication</div>

            <div class="dm-toggle-group" style="margin-bottom: 12px">
              <button class="dm-toggle" :class="{ active: authMode === 'oauth' }" @click="authMode = 'oauth'" type="button">Cloudflare Login</button>
              <button class="dm-toggle" :class="{ active: authMode === 'token' }" @click="authMode = 'token'" type="button">API Token</button>
            </div>

            <!-- OAuth Mode -->
            <div v-if="authMode === 'oauth'" class="dm-oauth-box">
              <div v-if="cfUserEmail" class="dm-oauth-connected">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #4ade80"><polyline points="20 6 9 17 4 12"/></svg>
                <div class="dm-oauth-user-info">
                  <span class="dm-oauth-status">Connected to Cloudflare</span>
                  <span class="dm-oauth-email">{{ cfUserEmail }}</span>
                </div>
                <button class="dm-btn-ghost" style="padding: 4px 8px; font-size: 11px" @click="cfUserEmail = ''; cfToken = ''" type="button">Disconnect</button>
              </div>
              <div v-else class="dm-oauth-connect-wrap">
                <button class="dm-oauth-btn" @click="openCloudflareOAuth" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                  </svg>
                  Connect with Cloudflare
                </button>
                <p class="dm-hint" style="margin-top: 8px; text-align: center">Authorizes Kyro to provision Workers, D1 & R2 automatically.</p>
              </div>
            </div>

            <!-- API Token Mode -->
            <div v-else>
              <label class="dm-label" for="deploy-token">API Token</label>
              <div class="dm-input-row">
                <input
                  id="deploy-token"
                  v-model="cfToken"
                  class="dm-input"
                  :type="showToken ? 'text' : 'password'"
                  placeholder="Enter your Cloudflare API token"
                  autocomplete="off"
                  spellcheck="false"
                />
                <button class="dm-eye-btn" @click="showToken = !showToken" type="button" :aria-label="showToken ? 'Hide token' : 'Show token'">
                  <svg v-if="!showToken" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener" class="dm-link">
                → Generate token in Cloudflare dashboard
              </a>
            </div>

            <!-- PostgreSQL URL -->
            <div v-if="database === 'postgres'" style="margin-top: 16px">
              <label class="dm-label" for="deploy-pg-url">PostgreSQL Connection URL</label>
              <input
                id="deploy-pg-url"
                v-model="pgUrl"
                class="dm-input"
                type="text"
                placeholder="postgresql://user:pass@host/db"
                autocomplete="off"
                spellcheck="false"
              />
            </div>

            <!-- Advanced -->
            <button class="dm-advanced-toggle" @click="advancedOpen = !advancedOpen" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: advancedOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"><polyline points="6 9 12 15 18 9"/></svg>
              Advanced options
            </button>
            <div v-if="advancedOpen" class="dm-advanced-body">
              <label class="dm-label" for="deploy-worker">Worker Name <span class="dm-optional">(optional)</span></label>
              <input id="deploy-worker" v-model="workerName" class="dm-input" type="text" :placeholder="projectName || 'my-kyro-app'" autocomplete="off" />

              <label class="dm-label" for="deploy-r2" style="margin-top: 10px">R2 Bucket Name <span class="dm-optional">(optional)</span></label>
              <input id="deploy-r2" v-model="r2Bucket" class="dm-input" type="text" placeholder="kyro-media-xxxxxx" autocomplete="off" />

              <div v-if="database === 'postgres'" style="margin-top: 10px">
                <label class="dm-label" for="deploy-hd">Hyperdrive Name <span class="dm-optional">(optional)</span></label>
                <input id="deploy-hd" v-model="hyperdriveName" class="dm-input" type="text" placeholder="kyro-postgres-hd-xxxxxx" autocomplete="off" />
              </div>
            </div>
          </div>

          <!-- ── STEP 4 — Deploy Log ───────────────────────────────────── -->
          <div v-else-if="step === 4 && !done" class="dm-body">
            <div class="dm-section-label">Deploying</div>
            <div id="deploy-log" class="dm-log">
              <div v-if="logLines.length === 0" class="dm-log-empty">Starting deployment…</div>
              <div
                v-for="(line, i) in logLines"
                :key="i"
                class="dm-log-line"
                :class="line.type"
              >
                <span class="dm-log-icon">
                  <svg v-if="line.type === 'success'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else-if="line.type === 'error'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <svg v-else-if="line.type === 'warning'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span v-else class="dm-spinner" />
                </span>
                <span class="dm-log-msg">{{ line.message }}</span>
              </div>
            </div>
            <div class="dm-deploying-status">
              <span class="dm-pulse" :class="{ error: !!error }" />
              <span class="dm-status-msg">{{ error ? 'Deployment failed' : activeStatus }}</span>
            </div>
          </div>

          <!-- ── DONE — Success ────────────────────────────────────────── -->
          <div v-if="done" class="dm-body dm-success">
            <div class="dm-check-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dm-check"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 class="dm-success-heading">Your site is live</h3>

            <div class="dm-url-row">
              <span class="dm-url-text">{{ liveUrl }}</span>
              <a :href="liveUrl" target="_blank" rel="noopener" class="dm-icon-btn" aria-label="Open site">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <button class="dm-icon-btn" @click="copyText(liveUrl, { value: urlCopied })" type="button" aria-label="Copy URL">
                <svg v-if="!urlCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>

            <div class="dm-creds">
              <div class="dm-creds-header">Credentials</div>
              <div class="dm-cred-row">
                <span class="dm-cred-key">Email</span>
                <span class="dm-cred-val">{{ resultAdminEmail }}</span>
                <button class="dm-icon-btn" @click="copyText(resultAdminEmail, emailCopied)" type="button" aria-label="Copy email">
                  <svg v-if="!emailCopied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
              <div class="dm-cred-row">
                <span class="dm-cred-key">Password</span>
                <span class="dm-cred-val">{{ showPass ? resultAdminPassword : '••••••••••••' }}</span>
                <button class="dm-icon-btn" @click="showPass = !showPass" type="button" :aria-label="showPass ? 'Hide' : 'Show'">
                  <svg v-if="!showPass" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
                <button class="dm-icon-btn" @click="copyText(resultAdminPassword, passCopied)" type="button" aria-label="Copy password">
                  <svg v-if="!passCopied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
              <p class="dm-creds-warn">Save these — they won't be shown again.</p>
            </div>
          </div>

          <!-- ── Footer ────────────────────────────────────────────────── -->
          <div class="dm-footer">
            <!-- Success footer -->
            <template v-if="done">
              <button class="dm-btn-ghost" @click="closeModal" type="button">Close</button>
              <a :href="`${liveUrl}/admin`" target="_blank" rel="noopener" class="dm-btn-primary">Open Admin Dashboard →</a>
            </template>

            <!-- Deploy log footer (deploying) -->
            <template v-else-if="step === 4 && deploying">
              <span class="dm-step-counter">Deploying…</span>
              <button class="dm-btn-primary" disabled>Deploying…</button>
            </template>

            <!-- Deploy log footer (error) -->
            <template v-else-if="step === 4 && error">
              <button class="dm-btn-ghost" @click="step = 3" type="button">← Back</button>
              <button class="dm-btn-primary" @click="startDeploy" type="button">Retry</button>
            </template>

            <!-- Normal nav -->
            <template v-else>
              <button v-if="step > 1" class="dm-btn-ghost" @click="prevStep" type="button">← Back</button>
              <span v-else class="dm-step-counter">Step {{ step }} of {{ TOTAL_STEPS }}</span>
              <button
                class="dm-btn-primary"
                :disabled="!stepValid"
                @click="nextStep"
                type="button"
              >
                {{ step === TOTAL_STEPS ? 'Deploy →' : 'Next →' }}
              </button>
            </template>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Trigger ──────────────────────────────────────────────────────────────── */
.deploy-trigger-wrapper {
  position: relative;
  display: inline-flex;
}
.deploy-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 7px;
  border: 1px solid var(--k-border);
  background: transparent;
  color: var(--k-text-1);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  white-space: nowrap;
}
.deploy-trigger:hover {
  background: var(--k-accent-ghost);
  border-color: var(--k-border-hover);
}
.deploy-trigger[disabled] {
  opacity: 0.45;
  cursor: not-allowed !important;
  pointer-events: none;
  border-color: var(--k-border);
  background: transparent;
}
.coming-soon-badge-notif {
  position: absolute;
  top: -8px;
  right: -5px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2.5px 7px;
  border-radius: 99px;
  line-height: 1;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.35);
  pointer-events: none;
  z-index: 5;
}
.pulse-dot {
  width: 4px;
  height: 4px;
  background: #a78bfa;
  border-radius: 50%;
  animation: pulse-purple 1.8s infinite ease-out;
}
@keyframes pulse-purple {
  0% { transform: scale(0.95); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
  100% { transform: scale(0.95); opacity: 1; }
}

/* ── Backdrop ─────────────────────────────────────────────────────────────── */
.dm-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

/* ── Modal wrapper ────────────────────────────────────────────────────────── */
.dm-wrap {
  position: fixed; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 1001;
  padding: 16px;
}

.dm-card {
  width: 100%;
  max-width: 420px;
  max-height: 88vh;
  overflow-y: auto;
  background: var(--k-bg-soft);
  border: 1px solid var(--k-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25), 0 0 0 1px var(--k-border) inset;
}

/* ── Header ───────────────────────────────────────────────────────────────── */
.dm-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 12px;
  border-bottom: 1px solid var(--k-border);
  flex-shrink: 0;
}
.dm-title-row { display: flex; align-items: center; gap: 8px; }
.dm-cloud-icon { color: var(--k-text-3); flex-shrink: 0; }
.dm-title { font-size: 14px; font-weight: 600; color: var(--k-text-1); margin: 0; }
.dm-close {
  width: 26px; height: 26px;
  border-radius: 5px; border: none;
  background: transparent; color: var(--k-text-3);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.dm-close:hover { background: var(--k-accent-ghost); color: var(--k-text-1); }
.dm-close:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── Steps ────────────────────────────────────────────────────────────────── */
.dm-steps {
  display: flex; align-items: center;
  padding: 10px 16px 0;
  flex-shrink: 0;
}
.dm-step-item { display: flex; align-items: center; flex: 1; }
.dm-step-item:last-child { flex: none; }
.dm-step-dot {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid var(--k-border-hover);
  background: transparent;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
  color: var(--k-bg-soft);
  font-size: 9px; font-weight: 700;
}
.dm-step-dot.active { background: var(--k-accent); border-color: var(--k-accent); color: var(--k-bg-soft); }
.dm-step-dot.done  { background: var(--k-accent); border-color: var(--k-accent); color: var(--k-bg-soft); }
.dm-step-line {
  flex: 1; height: 1px;
  background: var(--k-border);
  transition: background 0.2s;
}
.dm-step-line.done { background: var(--k-border-hover); }

/* ── Body ─────────────────────────────────────────────────────────────────── */
.dm-body {
  padding: 14px 16px;
  flex: 1;
  display: flex; flex-direction: column; gap: 8px;
}

.dm-section-label {
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--k-text-3); margin-bottom: 2px;
}

/* ── Form elements ────────────────────────────────────────────────────────── */
.dm-label {
  font-size: 12px; font-weight: 500; color: var(--k-text-2);
  display: block; margin-bottom: 4px;
}
.dm-input {
  width: 100%; padding: 7px 10px;
  background: var(--k-bg-mute);
  border: 1px solid var(--k-border);
  border-radius: 6px;
  color: var(--k-text-1); font-size: 13px; font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}
.dm-input:focus {
  border-color: var(--k-border-hover);
  box-shadow: 0 0 0 2px var(--k-accent-ghost);
}
.dm-input::placeholder { color: var(--k-text-3); }

.dm-input-row { display: flex; gap: 6px; }
.dm-input-row .dm-input { flex: 1; }
.dm-eye-btn {
  width: 32px; height: 32px; flex-shrink: 0;
  border-radius: 6px; border: 1px solid var(--k-border);
  background: var(--k-bg-mute); color: var(--k-text-3);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: color 0.15s, border-color 0.15s;
}
.dm-eye-btn:hover { color: var(--k-text-1); border-color: var(--k-border-hover); }

.dm-toggle-group { display: flex; gap: 5px; }
.dm-toggle {
  flex: 1; padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--k-border);
  background: transparent; color: var(--k-text-3);
  font-size: 12px; font-weight: 500; font-family: inherit;
  cursor: pointer; transition: all 0.15s;
}
.dm-toggle.active { background: var(--k-accent); color: var(--k-bg-soft); border-color: var(--k-accent); }
.dm-toggle:not(.active):hover { border-color: var(--k-border-hover); color: var(--k-text-1); }

/* ── OAuth ────────────────────────────────────────────────────────────────── */
.dm-oauth-box {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid var(--k-border);
  background: var(--k-bg-mute);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.dm-oauth-connect-wrap { display: flex; flex-direction: column; align-items: center; width: 100%; }
.dm-oauth-btn {
  width: 100%;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 16px; border-radius: 8px;
  border: 1px solid var(--k-border-hover);
  background: var(--k-accent); color: var(--k-bg-soft);
  font-size: 13px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: opacity 0.15s, transform 0.1s;
}
.dm-oauth-btn:hover { opacity: 0.92; }
.dm-oauth-btn:active { transform: scale(0.98); }

.dm-oauth-connected {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.dm-oauth-user-info { display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
.dm-oauth-status { font-size: 11px; font-weight: 600; color: #4ade80; text-transform: uppercase; letter-spacing: 0.05em; }
.dm-oauth-email { font-size: 13px; color: var(--k-text-1); font-weight: 500; }

/* ── Template grid ────────────────────────────────────────────────────────── */
.dm-template-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;
  margin-bottom: 2px;
}
.dm-template-card {
  padding: 7px 8px; border-radius: 6px;
  border: 1px solid var(--k-border);
  background: transparent; cursor: pointer;
  text-align: left; display: flex; flex-direction: column; gap: 2px;
  transition: border-color 0.15s, background 0.15s;
}
.dm-template-card.selected {
  border-color: var(--k-border-glow);
  background: var(--k-accent-ghost);
}
.dm-template-card:not(.selected):hover { border-color: var(--k-border-hover); }
.dm-template-name { font-size: 12px; font-weight: 500; color: var(--k-text-1); }
.dm-template-desc { font-size: 10px; color: var(--k-text-3); line-height: 1.3; }

/* ── Hint / link ──────────────────────────────────────────────────────────── */
.dm-hint { font-size: 11px; color: var(--k-text-3); margin: 0; }
.dm-link { font-size: 11px; color: var(--k-text-2); text-decoration: none; transition: color 0.15s; }
.dm-link:hover { color: var(--k-text-1); }
.dm-optional { color: var(--k-text-3); font-weight: 400; }

/* ── Advanced ─────────────────────────────────────────────────────────────── */
.dm-advanced-toggle {
  display: inline-flex; align-items: center; gap: 5px;
  background: transparent; border: none; color: var(--k-text-3);
  font-size: 11px; font-weight: 500; font-family: inherit;
  cursor: pointer; padding: 2px 0; margin-top: 2px;
  transition: color 0.15s;
}
.dm-advanced-toggle:hover { color: var(--k-text-1); }
.dm-advanced-body {
  padding: 10px 12px; border-radius: 7px;
  border: 1px solid var(--k-border);
  background: var(--k-bg-mute);
  display: flex; flex-direction: column; gap: 6px;
}

/* ── Deploy log ───────────────────────────────────────────────────────────── */
.dm-log {
  background: var(--k-bg-root); border-radius: 7px;
  border: 1px solid var(--k-border);
  padding: 10px 12px; min-height: 150px; max-height: 190px;
  overflow-y: auto; display: flex; flex-direction: column; gap: 5px;
  font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 11px;
}
.dm-log-empty { color: var(--k-text-3); }
.dm-log-line {
  display: flex; align-items: flex-start; gap: 7px; color: var(--k-text-3);
}
.dm-log-line.success { color: var(--k-text-2); }
.dm-log-line.error { color: #f87171; }
.dm-log-line.warning { color: #ca8a04; }
.dm-log-icon { flex-shrink: 0; margin-top: 1px; }
.dm-log-msg { flex: 1; line-height: 1.5; word-break: break-word; }

.dm-spinner {
  display: inline-block;
  width: 11px; height: 11px;
  border-radius: 50%;
  border: 1.5px solid var(--k-border-hover);
  border-top-color: var(--k-text-3);
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.dm-deploying-status {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; color: var(--k-text-3); margin-top: 2px;
  overflow: hidden;
}
.dm-status-msg {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
}
.dm-pulse {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--k-accent); opacity: 0.6;
  animation: pulse 1.5s ease-in-out infinite;
}
.dm-pulse.error { background: #f87171; animation: none; }
@keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 0.9; transform: scale(1.1); } }

/* ── Success ──────────────────────────────────────────────────────────────── */
.dm-success { align-items: center; text-align: center; }
.dm-check-wrap {
  width: 44px; height: 44px; border-radius: 50%;
  border: 1.5px solid var(--k-border-hover);
  display: flex; align-items: center; justify-content: center;
  margin: 4px auto 0;
}
.dm-check { color: var(--k-text-1); }
.dm-success-heading { font-size: 17px; font-weight: 600; color: var(--k-text-1); margin: 6px 0 0; }

.dm-url-row {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 12px; border-radius: 7px;
  border: 1px solid var(--k-border);
  background: var(--k-bg-mute); width: 100%; box-sizing: border-box;
  margin-top: 2px;
}
.dm-url-text { flex: 1; font-size: 12px; color: var(--k-text-2); font-family: 'JetBrains Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.dm-creds {
  width: 100%; border-radius: 7px;
  border: 1px solid var(--k-border);
  background: var(--k-bg-mute); overflow: hidden;
}
.dm-creds-header {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--k-text-3);
  padding: 8px 12px 6px; border-bottom: 1px solid var(--k-border);
  text-align: left;
}
.dm-cred-row {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 12px; border-bottom: 1px solid var(--k-border);
}
.dm-cred-row:last-of-type { border-bottom: none; }
.dm-cred-key { font-size: 11px; color: var(--k-text-3); width: 56px; text-align: left; flex-shrink: 0; }
.dm-cred-val { flex: 1; font-size: 11px; color: var(--k-text-2); font-family: 'JetBrains Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
.dm-creds-warn { font-size: 10px; color: var(--k-text-3); margin: 6px 12px; text-align: left; }

.dm-icon-btn {
  width: 24px; height: 24px; flex-shrink: 0;
  border-radius: 4px; border: none;
  background: transparent; color: var(--k-text-3);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: color 0.15s, background 0.15s; text-decoration: none;
}
.dm-icon-btn:hover { color: var(--k-text-1); background: var(--k-accent-ghost); }

/* ── Footer ───────────────────────────────────────────────────────────────── */
.dm-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--k-border);
  gap: 8px; flex-shrink: 0;
}
.dm-step-counter { font-size: 11px; color: var(--k-text-3); }

.dm-btn-primary {
  padding: 7px 16px; border-radius: 6px;
  border: none; background: var(--k-accent); color: var(--k-bg-root);
  font-size: 12px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap; text-decoration: none; display: inline-block;
}
.dm-btn-primary:hover:not(:disabled) { opacity: 0.85; }
.dm-btn-primary:active:not(:disabled) { transform: scale(0.97); }
.dm-btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }

.dm-btn-ghost {
  padding: 7px 12px; border-radius: 6px;
  border: 1px solid var(--k-border);
  background: transparent; color: var(--k-text-3);
  font-size: 12px; font-weight: 500; font-family: inherit;
  cursor: pointer; transition: border-color 0.15s, color 0.15s;
  white-space: nowrap;
}
.dm-btn-ghost:hover { border-color: var(--k-border-hover); color: var(--k-text-1); }

/* ── Transitions ──────────────────────────────────────────────────────────── */
.backdrop-enter-active, .backdrop-leave-active { transition: opacity 0.2s ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }

.modal-enter-active { transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.modal-enter-from { opacity: 0; transform: scale(0.96) translateY(8px); }
.modal-leave-to { opacity: 0; transform: scale(0.97); }

/* ── Scrollbar ────────────────────────────────────────────────────────────── */
.dm-card::-webkit-scrollbar, .dm-log::-webkit-scrollbar { width: 3px; }
.dm-card::-webkit-scrollbar-track, .dm-log::-webkit-scrollbar-track { background: transparent; }
.dm-card::-webkit-scrollbar-thumb, .dm-log::-webkit-scrollbar-thumb { background: var(--k-border-hover); border-radius: 4px; }
</style>
