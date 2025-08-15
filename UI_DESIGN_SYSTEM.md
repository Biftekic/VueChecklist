# Vue Cleaning Checklist App - UI/UX Design System

## Design Philosophy
- **Mobile-First**: Every element optimized for touch interaction
- **Clean & Minimal**: Maximum white space, minimal cognitive load
- **Material Design**: Following Material Design 3 principles
- **Beautiful Priority**: Aesthetics as the #1 priority per requirements

## Color Palette

### Primary Colors
```scss
// Main brand colors
$primary: #1976D2;        // Material Blue - main actions
$primary-light: #42A5F5;  // Hover states
$primary-dark: #1565C0;   // Active states

// Accent colors
$accent: #00BCD4;         // Cyan - highlights
$success: #4CAF50;        // Green - completion
$warning: #FF9800;        // Orange - attention
$error: #F44336;          // Red - errors
```

### Neutral Colors
```scss
$background: #FAFAFA;     // Light gray background
$surface: #FFFFFF;        // Card backgrounds
$text-primary: #212121;   // Main text
$text-secondary: #757575; // Secondary text
$divider: #E0E0E0;       // Borders and dividers
```

### Industry Colors (for template cards)
```scss
$office: #2196F3;         // Blue
$residential: #4CAF50;    // Green
$medical: #F44336;        // Red
$hospitality: #9C27B0;    // Purple
$restaurant: #FF9800;     // Orange
$retail: #00BCD4;         // Cyan
$airbnb: #FF5252;        // Pink
```

## Typography

### Font Family
```scss
$font-primary: 'Roboto', sans-serif;
$font-display: 'Roboto', sans-serif;
```

### Font Sizes (Mobile)
```scss
$h1: 24px;      // Page titles
$h2: 20px;      // Section headers
$h3: 18px;      // Card titles
$body1: 16px;   // Main content
$body2: 14px;   // Secondary content
$caption: 12px; // Small text
```

## Component Specifications

### Navigation

#### Bottom Navigation Bar (Mobile)
```
┌─────────────────────────────────────┐
│  Home │ Templates │ Create │ Lists  │
└─────────────────────────────────────┘
```
- Height: 56px
- Icons: 24px Material Icons
- Active state: Primary color + label visible
- Inactive: Gray icon, no label

### Cards

#### Template Industry Card
```
┌─────────────────────────────────────┐
│ [Icon]                              │
│                                     │
│ Office Cleaning                     │
│ 15 templates available              │
└─────────────────────────────────────┘
```
- Height: 120px
- Border radius: 12px
- Elevation: 2dp
- Padding: 16px
- Icon size: 48px

#### Checklist Card
```
┌─────────────────────────────────────┐
│ Client Name               3.5 hrs   │
│ 123 Main Street                     │
│ ─────────────────────────────────── │
│ Weekly • Office • 5 rooms           │
│                                     │
│ [Sync Icon] [PDF Icon] [Edit Icon]  │
└─────────────────────────────────────┘
```
- Border radius: 8px
- Elevation: 1dp
- Padding: 16px
- Action buttons: 40px touch targets

### Forms

#### Input Fields
```
┌─────────────────────────────────────┐
│ Label                               │
│ ┌─────────────────────────────────┐ │
│ │ User input text                  │ │
│ └─────────────────────────────────┘ │
│ Helper text                         │
└─────────────────────────────────────┘
```
- Height: 56px
- Border: 1px solid $divider
- Focus: 2px primary color
- Border radius: 4px
- Padding: 12px

#### Selection Controls

**Radio Buttons (Difficulty)**
```
○ Light
● Average  
○ Heavy
```
- Size: 20px
- Touch target: 48px
- Color: Primary when selected

**Checkboxes (Task Selection)**
```
☐ Dust all surfaces
☑ Clean windows
☑ Vacuum carpet
☐ Mop floors
```
- Size: 18px
- Touch target: 48px
- Check color: Primary

### Buttons

#### Primary Button
```
┌─────────────────────────┐
│     CONTINUE           │
└─────────────────────────┘
```
- Height: 48px
- Border radius: 24px
- Background: $primary
- Text: White, 14px, uppercase
- Elevation: 2dp

#### FAB (Floating Action Button)
```
    ┌────┐
    │ +  │
    └────┘
```
- Size: 56px
- Position: Bottom right, 16px margin
- Color: $accent
- Elevation: 6dp

### Lists

#### Task List Item
```
┌─────────────────────────────────────┐
│ ☐  Vacuum carpet                    │
│    15-20 minutes • Weekly           │
└─────────────────────────────────────┘
```
- Height: 72px min
- Padding: 16px
- Divider between items

#### Room List
```
┌─────────────────────────────────────┐
│ Kitchen                   45-60 min │
│ 8 tasks selected                    │
├─────────────────────────────────────┤
│ Bathroom                  30-45 min │
│ 6 tasks selected                    │
└─────────────────────────────────────┘
```

### Search Bar
```
┌─────────────────────────────────────┐
│ 🔍 Search tasks...                  │
└─────────────────────────────────────┘
```
- Height: 48px
- Background: White
- Border radius: 24px
- Elevation: 1dp
- Sticky position at top

## Screen Layouts

### Home Screen
```
┌─────────────────────────────────────┐
│        Cleaning Checklist Pro       │
├─────────────────────────────────────┤
│                                     │
│   ┌───────────┐  ┌───────────┐     │
│   │  Create   │  │   View    │     │
│   │    New    │  │   Lists   │     │
│   └───────────┘  └───────────┘     │
│                                     │
│   Recent Checklists                 │
│   ┌─────────────────────────┐       │
│   │ ABC Company - Office    │       │
│   └─────────────────────────┘       │
│   ┌─────────────────────────┐       │
│   │ XYZ Home - Residential  │       │
│   └─────────────────────────┘       │
│                                     │
├─────────────────────────────────────┤
│  Home │ Templates │ Create │ Lists  │
└─────────────────────────────────────┘
```

### Template Selection
```
┌─────────────────────────────────────┐
│ ← Select Industry                   │
├─────────────────────────────────────┤
│                                     │
│   ┌───────────┐  ┌───────────┐     │
│   │   Office  │  │Residential│     │
│   └───────────┘  └───────────┘     │
│                                     │
│   ┌───────────┐  ┌───────────┐     │
│   │  Medical  │  │Hospitality│     │
│   └───────────┘  └───────────┘     │
│                                     │
│   ┌───────────┐  ┌───────────┐     │
│   │Restaurant │  │   Retail  │     │
│   └───────────┘  └───────────┘     │
│                                     │
├─────────────────────────────────────┤
│  Home │ Templates │ Create │ Lists  │
└─────────────────────────────────────┘
```

### Create Checklist Flow

#### Step 1: Property Details
```
┌─────────────────────────────────────┐
│ ← Property Details         Step 1/5 │
├─────────────────────────────────────┤
│                                     │
│ Property Size (m²)                  │
│ ┌─────────────────────────┐         │
│ │ 350                     │         │
│ └─────────────────────────┘         │
│                                     │
│ Number of Floors                    │
│ ┌─────────────────────────┐         │
│ │ 2                       │         │
│ └─────────────────────────┘         │
│                                     │
│ Difficulty                          │
│ ○ Light                             │
│ ● Average                           │
│ ○ Heavy                             │
│                                     │
│ Expectations                        │
│ ○ Very Reasonable                   │
│ ● Reasonable                        │
│ ○ Average                           │
│ ○ Demanding                         │
│ ○ Very Demanding                    │
│                                     │
│       [ CONTINUE ]                  │
│                                     │
└─────────────────────────────────────┘
```

#### Step 2: Room Selection
```
┌─────────────────────────────────────┐
│ ← Select Rooms            Step 2/5  │
├─────────────────────────────────────┤
│                                     │
│ Standard Rooms                      │
│ ☑ Reception                         │
│ ☑ Office (5)                        │
│ ☑ Meeting Room                      │
│ ☑ Kitchen                           │
│ ☑ Bathroom (2)                      │
│ ☐ Server Room                       │
│ ☐ Storage Room                      │
│                                     │
│ + Add Custom Room                   │
│                                     │
│       [ CONTINUE ]                  │
│                                     │
└─────────────────────────────────────┘
```

#### Step 3: Task Selection
```
┌─────────────────────────────────────┐
│ ← Kitchen Tasks           Step 3/5  │
├─────────────────────────────────────┤
│ 🔍 Search tasks...                  │
├─────────────────────────────────────┤
│                                     │
│ ☑ Counter Cleaning      10-15 min  │
│ ☑ Sink Sanitization     5-10 min   │
│ ☑ Appliance Cleaning    15-20 min  │
│ ☐ Floor Mopping         10-15 min  │
│ ☑ Trash Disposal        5 min      │
│ ☐ Cabinet Organizing    20-30 min  │
│                                     │
│ Total Time: 35-50 minutes           │
│                                     │
│       [ CONTINUE ]                  │
│                                     │
└─────────────────────────────────────┘
```

## Animations & Transitions

### Page Transitions
- Slide left/right: 300ms ease-out
- Fade in/out: 200ms ease-in-out

### Micro-interactions
- Button press: Scale 0.95, 100ms
- Checkbox: Checkmark draw animation, 200ms
- Card tap: Elevation increase, ripple effect
- FAB: Rotate + on press

### Loading States
- Skeleton screens for lists
- Circular progress for actions
- Pull-to-refresh animation

## Responsive Breakpoints

```scss
// Mobile first approach
$mobile: 0px;        // Default
$tablet: 768px;      // Not needed per requirements
$desktop: 1024px;    // Not needed per requirements
```

## Accessibility

### Touch Targets
- Minimum size: 48x48px
- Spacing between targets: 8px minimum

### Contrast Ratios
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus Indicators
- 2px solid outline
- Color: $primary
- Visible on keyboard navigation

## Error States

### Input Errors
```
┌─────────────────────────────────────┐
│ Email Address                       │
│ ┌─────────────────────────────────┐ │
│ │ invalid@email                    │ │
│ └─────────────────────────────────┘ │
│ ⚠ Please enter a valid email       │
└─────────────────────────────────────┘
```
- Border: 2px solid $error
- Helper text: $error color
- Icon: Warning symbol

### Empty States
```
┌─────────────────────────────────────┐
│                                     │
│         No checklists yet           │
│                                     │
│     [ Create Your First ]           │
│                                     │
└─────────────────────────────────────┘
```

## Success Feedback

### Toast Notifications
```
┌─────────────────────────────────────┐
│ ✓ Checklist saved successfully      │
└─────────────────────────────────────┘
```
- Position: Bottom, 16px margin
- Duration: 3 seconds
- Background: $success

### Progress Indicators
- Linear progress bar for multi-step flows
- Circular progress for single actions
- Step indicators: 1/5, 2/5, etc.

---

*Last Updated: [Current Date]*
*Version: 1.0*