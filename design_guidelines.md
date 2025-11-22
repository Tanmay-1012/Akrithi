# Samsung S25 Ultra Murder Mystery Phone - Design Guidelines

## Design Approach
This is a single-page interactive experience mimicking a Samsung S25 Ultra phone interface. The design must authentically replicate Samsung's One UI 7 design language while maintaining a dark, mysterious atmosphere appropriate for a crime investigation scenario.

## Device Specifications
- **Device Frame**: Samsung S25 Ultra with curved edge display effect, centered punch-hole camera at top
- **Aspect Ratio**: 19.5:9 display ratio, rounded corners (48px radius)
- **Viewport**: Contained phone mockup centered on desktop, full-screen on mobile
- **Edge Lighting**: Subtle gradient edge glow effect to simulate curved display

## Typography
- **Primary Font**: Samsung One (fallback: Roboto, system-ui)
- **Lock Screen Time**: 96px, ultra-thin weight
- **Lock Screen Date**: 18px, regular weight
- **App Labels**: 13px, medium weight
- **Message Text**: 16px, regular weight
- **Contact Names**: 17px, semi-bold weight

## Layout System
Use Tailwind spacing units: 1, 2, 4, 6, 8, 12, 16 for consistent spacing throughout all phone UI elements.

## Component Library

### 1. Lock Screen (Initial State)
- Full-screen dark gradient background (#0a0a0a to #1a1a1a)
- Status bar with Samsung icons (signal, WiFi, battery at 47%)
- Large centered clock display
- Date below clock
- Bottom notification: "2 new messages" with app icon
- Swipe-up indicator or PIN pad entry
- Password input field (styled as Samsung numerical keypad or text input)

### 2. Home Screen (Post-Unlock)
- Samsung One UI app grid layout (4x6 grid)
- Status bar matching lock screen
- Dock with 4 primary apps at bottom
- Widgets: Clock widget, battery/weather widget
- App Icons Required:
  - Messages (functional - green bubble icon)
  - Phone, Camera, Gallery, Settings, Chrome, YouTube, Instagram, WhatsApp (visual only)
- Realistic app icon shadows and Samsung icon style

### 3. Messages App Interface
- Samsung Messages header with "Messages" title and back arrow
- Conversation List View:
  - Contact "Unknown Number" with preview "I KNOW YOUR SECRET..."
  - Contact "Meenakshi" with preview "SORRY I SHOULDN'T HAVE..."
  - Timestamps (today, different hours)
  - Unread indicators
  
- Individual Conversation View:
  - **Conversation 1 (Akriti to Unknown Number)**:
    - Sent bubble (blue): "I KNOW YOUR SECRET AND I WON'T LET YOU GO"
    - Timestamp: Today, 10:47 PM
  - **Conversation 2 (Meenakshi to Akriti)**:
    - Received bubble (gray): "SORRY I SHOULDN'T HAVE HACKED YOUR PHONE"
    - Timestamp: Today, 8:23 PM
- Samsung bubble styling: rounded corners, subtle shadows
- Non-functional text input at bottom (visual only)

### 4. Navigation Patterns
- Swipe/tap transitions between screens
- Back navigation from Messages to Home
- Smooth fade animations (200-300ms)
- Samsung-style page transitions

## Color Palette
- **Background**: #0a0a0a (deep black)
- **Surface**: #1a1a1a (dark gray)
- **Samsung Blue**: #1e88e5 (sent messages, accents)
- **Received Bubble**: #2d2d2d
- **Text Primary**: #ffffff
- **Text Secondary**: #b0b0b0
- **Accent Green**: #00c853 (Messages app icon)
- **Status Bar Icons**: #e0e0e0

## Accessibility
- Minimum touch target: 48px for all interactive elements
- High contrast text on all backgrounds
- Clear focus states for password input
- Screen reader labels for mystery context

## Animations
- Lock screen unlock: Smooth fade and scale transition
- App opening: Samsung zoom animation from icon
- Message bubble appearance: Subtle slide-in from appropriate side
- Keep all animations under 400ms for responsiveness

## Images
No external images required - all UI elements should be CSS/SVG-based for authentic Samsung recreation. Use CSS gradients, shadows, and SVG icons for status bar symbols.

## Critical Implementation Notes
- Password functionality must be fully working before any content accessible
- Only Messages app responds to clicks - all others are decorative
- Maintain Samsung S25 Ultra proportions even on desktop (show as phone mockup)
- Dark theme throughout - no light mode option
- Ensure mystery atmosphere through subtle dark gradients and ominous feel