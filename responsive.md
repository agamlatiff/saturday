Product Requirements Document: "Saturday" Responsive Web Application

1. Introduction

Project: Saturday Warehouse & Merchant Management
Date: November 12, 2025
Author: Gemini

This document outlines the requirements for converting the existing desktop-first "Saturday" web application into a fully responsive web application that provides a seamless user experience across desktops, tablets, and mobile devices.

2. Problem Statement

The "Saturday" application is a powerful tool for warehouse managers and merchant keepers. However, its current design is optimized for desktop use only. Users (Managers, Keepers) are increasingly mobile and need to perform key tasks—such as checking inventory, managing transactions, and viewing reports—while on the go, either on the warehouse floor or away from their desks.

The current desktop-centric design is unusable on mobile and tablet devices, leading to frustration, inefficiency, and a reliance on being at a computer. This limits the application's utility and user accessibility.

3. Goals & Objectives

The primary goal of this initiative is to make the "Saturday" application fully responsive, accessible, and functional on all major device types.

Goal 1: Ensure a seamless and consistent user experience across desktop, tablet, and mobile.

Goal 2: Make 100% of the application's desktop functionality accessible and usable on mobile devices.

Goal 3: Improve on-the-go productivity for "Manager" and "Keeper" user roles.

Goal 4: Eliminate all horizontal scrolling on viewports smaller than 1024px.

4. Key Responsive User Stories

General Navigation

As a user, I want to navigate the application easily on my mobile phone, so I can access all pages without difficulty.

As a user, I want to use the search functionality from my mobile device, so I can find pages or items quickly.

Core Functionality

As a Manager, I want to view the main "Overview" dashboard on my tablet, so I can check total revenue, transactions, and products sold at a glance.

As a Keeper, I want to view my "Merchant Overview" on my phone, so I can see my latest transactions while away from the counter.

As a Manager, I want to view lists of Products, Categories, Warehouses, Merchants, and Users in a mobile-friendly format, so I can review data without horizontal scrolling.

As a Manager, I want to fill out "Add New" and "Edit" forms (for Products, Users, Warehouses, etc.) on my phone, so I can make quick changes from anywhere.

As a Keeper, I want to process a "New Transaction" (multi-step form) entirely on a tablet, so I can serve customers directly.

As a user, I want to view "Product Details" and "Assign Product" modals, and have them correctly scale to my mobile screen.

5. Requirements

5.1. Design & UX Requirements (General)

Layout: The application must use a fluid, responsive layout that adapts to all screen sizes, from a minimum width of 360px up to large desktops.

Breakpoint Strategy: Use Tailwind CSS's standard responsive breakpoints (sm:, md:, lg:, xl:) to adapt the layout.

Touch Targets: All buttons, links, form inputs, and other interactive elements must have a minimum touch target size of 44x44 CSS pixels on mobile and tablet.

Typography: Font sizes must be legible on all devices. Use responsive typography (e.g., text-base lg:text-lg) where appropriate.

Scrolling: No horizontal scrolling shall be present on any page at any breakpoint. Vertical scrolling is expected.

5.2. Technical & Component-Specific Requirements

Component / Page

File(s)

Desktop Behavior (Current)

Mobile/Tablet Behavior (Required)

Main Navigation (Sidebar)

Sidebar.tsx

Fixed-width sidebar visible on the left.

Sidebar must be hidden by default. 



 A "hamburger" menu icon should be added to the Top Bar. 



 On tap, the sidebar should slide in from the left as an overlay.

Top Bar / Header

UserProfileCard.tsx, SearchButton.tsx, various pages

Horizontal layout with page title, search button, and user profile card.

The Top Bar must be adapted to include the new hamburger menu icon. 



 The UserProfileCard may need to be simplified (e.g., show icon only) or moved into the slide-out menu to save space.

Dashboard / Overview

Overview.tsx, OverviewMerchant.tsx

3-column grid for stat cards.

The 3-column grid (grid-cols-3) must stack vertically. 



 grid-cols-1 md:grid-cols-3

List Pages (Cards)

ProductList.tsx, CategoryList.tsx, WarehouseList.tsx, MerchantList.tsx, UserList.tsx

Wide, horizontal card layout for each item with details and action buttons on the right.

The list items (cards) must stack vertically. 



 The inner content of the card (e.g., product info, stock, category) must also stack vertically or wrap appropriately. 



 Action buttons (Details, Edit) should stack vertically at the bottom of the card.

Forms (2-Column Layout)

AddCategory.tsx, AddProduct.tsx, AddWarehouse.tsx, Edit* pages, AssignProduct.tsx

flex gap-6 layout with the main form on the left (w-full) and a "Quick Guide" panel on the right (w-[392px]).

The layout must stack vertically. The "Quick Guide" panel should appear below the main form. 



 flex flex-col lg:flex-row gap-6

Transaction Form

AddTransaction.tsx, StepOne.tsx, StepTwo.tsx, StepThree.tsx

3-step process. ProgressBar shows icons and text. StepThree is a 2-column layout.

ProgressBar: On mobile, hide the text labels ("Customer Detail") and show only the icons and "Step 1", "Step 2", etc. 



 StepThree: The 2-column layout (purchased items and payment info) must stack vertically.

Modals

ProductModal.tsx, SearchModal.tsx, ProductList.tsx (Details)

Centered modal with a fixed width (e.g., w-[406px] or w-full max-w-2xl).

Modals should adapt to be full-width or near-full-width (e.g., w-full max-w-md mx-4) on small screens. 



 Content within the modal (e.g., product details, cart items) must also be responsive.

6. Out of Scope

Backend API changes (all existing endpoints will be used).

Addition of new features not listed above.

Major redesign of branding, color palette, or logos.

Support for Internet Explorer or other legacy browsers.

7. Success Metrics

100% Usability: All user stories and flows can be completed on a mobile device (iPhone 13, Samsung S21) and tablet (iPad Air).

No Visual Regressions: The application passes manual testing on common breakpoints (360px, 768px, 1024px, 1280px+).

No Horizontal Scrolling: No page on the site causes horizontal scrolling at any breakpoint.

Performance: Lighthouse performance and accessibility scores are maintained or improved.