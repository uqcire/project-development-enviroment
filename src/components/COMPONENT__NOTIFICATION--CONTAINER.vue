<!--
  Notification Container Component
  
  This component displays user-friendly notifications including error messages,
  success messages, warnings, and info messages with auto-dismiss functionality.
  
  BEM Naming: COMPONENT__NOTIFICATION--CONTAINER
  - Block: COMPONENT (reusable UI component)
  - Element: NOTIFICATION (notification display functionality)
  - Modifier: CONTAINER (contains multiple notifications)
-->

<template>
  <Teleport to="body">
    <div v-if="notifications.length > 0" class="notification-container">
      <TransitionGroup 
        name="notification" 
        tag="div" 
        class="notification-container__list"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'notification',
            `notification--${notification.type}`,
            { 'notification--dismissible': notification.dismissible }
          ]"
        >
          <div class="notification__icon">
            <component :is="getIconComponent(notification.type)" />
          </div>
          
          <div class="notification__content">
            <h4 v-if="notification.title" class="notification__title">
              {{ notification.title }}
            </h4>
            
            <p class="notification__message">
              {{ notification.message }}
            </p>
            
            <div v-if="notification.actions" class="notification__actions">
              <button
                v-for="action in notification.actions"
                :key="action.label"
                @click="handleAction(notification, action)"
                :class="[
                  'notification__action',
                  `notification__action--${action.type || 'default'}`
                ]"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
          
          <button
            v-if="notification.dismissible"
            @click="dismiss(notification.id)"
            class="notification__close"
            aria-label="Close notification"
          >
            <CloseIcon />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Notification data structure
 */
const notifications = ref([])

/**
 * Auto-dismiss timers
 */
const timers = new Map()

/**
 * Add a new notification
 */
function addNotification(notification) {
  const id = generateId()
  const newNotification = {
    id,
    type: 'info',
    title: '',
    message: '',
    duration: 5000,
    dismissible: true,
    actions: [],
    ...notification
  }
  
  notifications.value.push(newNotification)
  
  // Set auto-dismiss timer if duration > 0
  if (newNotification.duration > 0) {
    const timer = setTimeout(() => {
      dismiss(id)
    }, newNotification.duration)
    
    timers.set(id, timer)
  }
  
  return id
}

/**
 * Dismiss a notification
 */
function dismiss(id) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
    
    // Clear timer if exists
    if (timers.has(id)) {
      clearTimeout(timers.get(id))
      timers.delete(id)
    }
  }
}

/**
 * Clear all notifications
 */
function clearAll() {
  notifications.value = []
  
  // Clear all timers
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
}

/**
 * Handle notification action click
 */
function handleAction(notification, action) {
  if (action.handler) {
    action.handler(notification)
  }
  
  // Auto-dismiss on action if specified
  if (action.dismissOnClick !== false) {
    dismiss(notification.id)
  }
}

/**
 * Get icon component for notification type
 */
function getIconComponent(type) {
  const icons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  }
  
  return icons[type] || InfoIcon
}

/**
 * Generate unique ID
 */
function generateId() {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Convenience methods for different notification types
 */
function showSuccess(message, options = {}) {
  return addNotification({
    type: 'success',
    message,
    ...options
  })
}

function showError(message, options = {}) {
  return addNotification({
    type: 'error',
    message,
    duration: 0, // Don't auto-dismiss errors by default
    ...options
  })
}

function showWarning(message, options = {}) {
  return addNotification({
    type: 'warning',
    message,
    ...options
  })
}

function showInfo(message, options = {}) {
  return addNotification({
    type: 'info',
    message,
    ...options
  })
}

/**
 * Setup global access
 */
onMounted(() => {
  // Make notification system globally available
  window.notifications = {
    add: addNotification,
    dismiss,
    clearAll,
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo
  }
})

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  clearAll()
  delete window.notifications
})

// Icon components
const SuccessIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.54 21H20.46A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const CloseIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

// Expose methods for parent components
defineExpose({
  addNotification,
  dismiss,
  clearAll,
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: var(--z-modal, 1050);
  pointer-events: none;
}

.notification-container__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3, 0.75rem);
  align-items: flex-end;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3, 0.75rem);
  min-width: 320px;
  max-width: 480px;
  padding: var(--space-4, 1rem);
  background: white;
  border-radius: var(--radius-lg, 0.5rem);
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  border-left: 4px solid var(--color-info, #3b82f6);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.notification--success {
  border-left-color: var(--color-success, #10b981);
}

.notification--error {
  border-left-color: var(--color-danger, #ef4444);
}

.notification--warning {
  border-left-color: var(--color-warning, #f59e0b);
}

.notification--info {
  border-left-color: var(--color-info, #3b82f6);
}

.notification__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;
}

.notification--success .notification__icon {
  color: var(--color-success, #10b981);
}

.notification--error .notification__icon {
  color: var(--color-danger, #ef4444);
}

.notification--warning .notification__icon {
  color: var(--color-warning, #f59e0b);
}

.notification--info .notification__icon {
  color: var(--color-info, #3b82f6);
}

.notification__content {
  flex: 1;
  min-width: 0;
}

.notification__title {
  margin: 0 0 var(--space-1, 0.25rem) 0;
  font-size: var(--font-size-base, 1rem);
  font-weight: 600;
  color: var(--color-text, #1f2937);
  line-height: 1.4;
}

.notification__message {
  margin: 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.5;
  word-wrap: break-word;
}

.notification__actions {
  display: flex;
  gap: var(--space-2, 0.5rem);
  margin-top: var(--space-3, 0.75rem);
}

.notification__action {
  padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
  border: 1px solid transparent;
  border-radius: var(--radius-base, 0.25rem);
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.notification__action--default {
  color: var(--color-text-secondary, #6b7280);
  border-color: var(--color-border, #d1d5db);
}

.notification__action--default:hover {
  background: var(--color-bg-secondary, #f9fafb);
  border-color: var(--color-border-hover, #9ca3af);
}

.notification__action--primary {
  color: white;
  background: var(--color-primary, #3b82f6);
}

.notification__action--primary:hover {
  background: var(--color-primary-dark, #2563eb);
}

.notification__close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;
  margin-left: var(--space-2, 0.5rem);
  margin-top: 2px;
  background: transparent;
  border: none;
  border-radius: var(--radius-base, 0.25rem);
  color: var(--color-text-tertiary, #9ca3af);
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification__close:hover {
  color: var(--color-text-secondary, #6b7280);
  background: var(--color-bg-secondary, #f3f4f6);
}

.notification__close svg {
  width: 16px;
  height: 16px;
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification {
    min-width: auto;
    max-width: none;
  }
  
  .notification__actions {
    flex-direction: column;
  }
  
  .notification__action {
    justify-self: stretch;
    text-align: center;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .notification {
    background: var(--color-bg-dark, #1f2937);
    color: var(--color-text-dark, #f9fafb);
  }
  
  .notification__title {
    color: var(--color-text-dark, #f9fafb);
  }
  
  .notification__message {
    color: var(--color-text-secondary-dark, #d1d5db);
  }
  
  .notification__action--default {
    color: var(--color-text-secondary-dark, #d1d5db);
    border-color: var(--color-border-dark, #4b5563);
  }
  
  .notification__action--default:hover {
    background: var(--color-bg-secondary-dark, #374151);
    border-color: var(--color-border-hover-dark, #6b7280);
  }
  
  .notification__close {
    color: var(--color-text-tertiary-dark, #9ca3af);
  }
  
  .notification__close:hover {
    color: var(--color-text-secondary-dark, #d1d5db);
    background: var(--color-bg-secondary-dark, #374151);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .notification {
    border: 2px solid;
  }
  
  .notification--success {
    border-color: var(--color-success, #10b981);
  }
  
  .notification--error {
    border-color: var(--color-danger, #ef4444);
  }
  
  .notification--warning {
    border-color: var(--color-warning, #f59e0b);
  }
  
  .notification--info {
    border-color: var(--color-info, #3b82f6);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .notification-enter-active,
  .notification-leave-active,
  .notification-move {
    transition: none;
  }
  
  .notification {
    transition: none;
  }
}
</style> 