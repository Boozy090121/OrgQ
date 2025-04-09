# PCI Quality Organization Dashboard - User Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Admin User Guide](#admin-user-guide)
   - [Getting Started](#admin-getting-started)
   - [User Management](#user-management)
   - [Organization Structure Management](#organization-structure-management)
   - [Timeline Builder](#timeline-builder)
   - [Budget Analysis](#budget-analysis)
   - [Resource Calculator](#resource-calculator)
   - [Data Import/Export](#data-import-export)
   - [System Settings](#system-settings)
3. [Viewer User Guide](#viewer-user-guide)
   - [Getting Started](#viewer-getting-started)
   - [Navigating the Dashboard](#navigating-the-dashboard)
   - [Viewing Organization Structures](#viewing-organization-structures)
   - [Understanding Timeline Visualizations](#understanding-timeline-visualizations)
   - [Interpreting Budget Data](#interpreting-budget-data)
   - [Using the Resource Calculator](#using-the-resource-calculator)
4. [Troubleshooting](#troubleshooting)
5. [FAQ](#faq)

## Introduction <a name="introduction"></a>

The PCI Quality Organization Dashboard is a comprehensive web application designed to help quality managers and executives visualize, manage, and plan the reorganization of PCI's quality department across multiple focus factories. This documentation provides detailed instructions for both administrators and viewers on how to use the dashboard effectively.

The dashboard is built with the following key features:
- Multi-factory organization structure management
- User authentication and role-based access control
- Implementation timeline builder
- Budget analysis and visualization
- Resource management calculator
- Data import/export capabilities
- Mobile-responsive interface optimized for tablets

## Admin User Guide <a name="admin-user-guide"></a>

### Getting Started <a name="admin-getting-started"></a>

#### Logging In

1. Navigate to the PCI Quality Organization Dashboard login page
2. Enter your admin email and password
3. Click "Sign In"
4. You will be redirected to the dashboard home page
5. Admin users are identified by an "Admin" badge in the header

#### Dashboard Overview

The admin dashboard provides full access to all features of the application, including:
- Organization structure management
- Timeline builder
- Budget analysis
- Resource calculator
- User management
- Data import/export
- System settings

The main navigation is located in the sidebar on the left side of the screen. On mobile devices, the sidebar can be accessed by clicking the menu icon in the top-left corner.

### User Management <a name="user-management"></a>

As an admin, you can manage user accounts through the Admin > Users section.

#### Viewing Users

1. Navigate to Admin > Users from the sidebar
2. View the list of all users with their roles (Admin or Viewer)
3. Use the search box to find specific users

#### Creating New Users

1. Navigate to Admin > Users from the sidebar
2. Click the "Add User" button
3. Enter the user's email address
4. Select the user's role (Admin or Viewer)
5. Click "Create User"
6. The system will generate a temporary password and display it on screen
7. Share this temporary password with the new user (they will be prompted to change it on first login)

#### Editing User Roles

1. Navigate to Admin > Users from the sidebar
2. Find the user you want to edit
3. Click the "Edit" button next to their name
4. Change their role using the dropdown menu
5. Click "Save Changes"

#### Deleting Users

1. Navigate to Admin > Users from the sidebar
2. Find the user you want to delete
3. Click the "Delete" button next to their name
4. Confirm the deletion in the popup dialog

### Organization Structure Management <a name="organization-structure-management"></a>

The organization structure management feature allows you to create and manage the quality department's organizational structure across multiple focus factories.

#### Foundation View

The Foundation View shows core quality roles that apply across all focus factories.

1. Navigate to Organization > Foundation from the sidebar
2. View the hierarchical structure of core quality roles
3. The Quality Director is displayed as the top-level role
4. Systems Lead and shared resources that support all factories are also displayed

#### Managing Focus Factory Views

Each focus factory has its own specialized staffing based on client/product needs.

1. Navigate to Organization > [Factory Name] from the sidebar
2. View the factory-specific organizational structure
3. Use the factory selector at the top to switch between factories

#### Creating and Editing Roles

1. Navigate to the appropriate organization view (Foundation or specific factory)
2. Click the "Add Role" button
3. Fill in the role details:
   - Position title
   - Department
   - Reporting relationships
   - Core responsibilities
   - Detailed responsibilities
   - Salary range
   - Role level (leadership, specialist, associate)
4. Click "Save Role"

To edit an existing role:
1. Click on the role card you want to edit
2. Click the "Edit" button
3. Modify the role details
4. Click "Save Changes"

#### Managing Personnel

1. Navigate to the appropriate organization view
2. To assign personnel to a role, drag and drop from the "Unassigned Personnel" section to the appropriate role card
3. To unassign personnel, drag them back to the "Unassigned Personnel" section
4. To add new personnel:
   - Click the "Add Personnel" button
   - Fill in the personnel details
   - Click "Save"

### Timeline Builder <a name="timeline-builder"></a>

The Timeline Builder allows you to create and manage the implementation timeline for the quality department reorganization.

#### Creating Phases

1. Navigate to Timeline from the sidebar
2. Click the "Add Phase" button
3. Fill in the phase details:
   - Title
   - Start date
   - End date
   - Description
   - Order (sequence number)
4. Click "Save Phase"

#### Managing Activities

Each phase can contain multiple activities.

1. Navigate to Timeline from the sidebar
2. Find the phase you want to add activities to
3. Click the "Add Activity" button within that phase
4. Fill in the activity details:
   - Title
   - Description
   - Order (sequence number)
5. Click "Save Activity"

To edit an existing activity:
1. Click the edit icon next to the activity
2. Modify the activity details
3. Click "Save Changes"

#### Reordering Phases and Activities

1. Navigate to Timeline from the sidebar
2. Use the up/down arrows next to each phase to change its order
3. Similarly, use the up/down arrows next to each activity to change its order within a phase

### Budget Analysis <a name="budget-analysis"></a>

The Budget Analysis module provides tools to analyze and visualize the budget implications of the quality department reorganization.

#### Viewing Budget Data

1. Navigate to Budget from the sidebar
2. View the overall budget summary at the top
3. See detailed breakdowns by:
   - Factory
   - Role level (leadership, specialist, associate)
   - Department

#### Filtering Budget Data

1. Navigate to Budget from the sidebar
2. Use the factory selector to filter by specific factory
3. Use the department selector to filter by department
4. Use the time period selector to view budget projections for different periods

#### Exporting Budget Reports

1. Navigate to Budget from the sidebar
2. Click the "Export" button
3. Select the export format (CSV or PDF)
4. Choose what data to include in the export
5. Click "Generate Report"
6. Save the downloaded file to your computer

### Resource Calculator <a name="resource-calculator"></a>

The Resource Calculator helps determine staffing needs based on work order volume and other factors.

#### Creating Staffing Scenarios

1. Navigate to Resources from the sidebar
2. Enter the work order volume
3. Adjust current staffing levels for each role type (leadership, specialist, associate)
4. View the recommended staffing levels and gap analysis
5. Click "Save Scenario" to save this configuration
6. Enter a name for the scenario
7. Click "Save"

#### Comparing Scenarios

1. Navigate to Resources > Compare from the sidebar
2. Select up to three scenarios to compare
3. View the side-by-side comparison of staffing levels and gaps
4. Use the visualization to identify the optimal staffing configuration

### Data Import/Export <a name="data-import-export"></a>

The data import/export feature allows you to backup data or transfer it between environments.

#### Exporting Data

1. Navigate to Admin > Data from the sidebar
2. Select what data to export:
   - All data
   - Organization structure only
   - Personnel only
   - Timeline only
   - Budget only
   - Resource scenarios only
3. Click "Export Data"
4. Save the downloaded JSON file to your computer

#### Importing Data

1. Navigate to Admin > Data from the sidebar
2. Click "Import Data"
3. Select the JSON file to import
4. Choose whether to merge with existing data or replace it
5. Click "Upload and Import"
6. Review the import summary and confirm

### System Settings <a name="system-settings"></a>

The system settings allow you to configure various aspects of the dashboard.

1. Navigate to Admin > Settings from the sidebar
2. Adjust the following settings as needed:
   - Default factory view
   - Color theme
   - Notification preferences
   - Auto-save settings
3. Click "Save Settings" to apply changes

## Viewer User Guide <a name="viewer-user-guide"></a>

### Getting Started <a name="viewer-getting-started"></a>

#### Logging In

1. Navigate to the PCI Quality Organization Dashboard login page
2. Enter your email and password
3. Click "Sign In"
4. You will be redirected to the dashboard home page
5. Viewer users are identified by a "View Only" indicator in the header

Alternatively, you can access the dashboard in view-only mode without logging in by clicking "Continue as Guest" on the login page.

#### Dashboard Overview

The viewer dashboard provides read-only access to all visualization features of the application, including:
- Organization structure views
- Timeline visualization
- Budget analysis
- Resource calculator (in read-only mode)

The main navigation is located in the sidebar on the left side of the screen. On mobile devices, the sidebar can be accessed by clicking the menu icon in the top-left corner.

### Navigating the Dashboard <a name="navigating-the-dashboard"></a>

#### Using the Sidebar

The sidebar contains links to all main sections of the dashboard:
- Dashboard Home
- Organization Structure
- Timeline
- Budget
- Resources
- Factories

Click on any link to navigate to that section.

#### Using the Factory Selector

Many views in the dashboard are factory-specific. Use the factory selector at the top of these pages to switch between different focus factories.

#### Search Functionality

Use the search box in the header to find specific information across the dashboard:
1. Click the search icon in the top-right corner
2. Enter your search term
3. View the search results, categorized by section
4. Click on any result to navigate to that item

### Viewing Organization Structures <a name="viewing-organization-structures"></a>

#### Foundation View

1. Navigate to Organization > Foundation from the sidebar
2. View the hierarchical structure of core quality roles
3. Click on any role card to expand it and see more details

#### Factory-Specific Views

1. Navigate to Organization > [Factory Name] from the sidebar
2. View the factory-specific organizational structure
3. Use the factory selector at the top to switch between factories

#### Role Details

1. Click on any role card to view detailed information
2. See the following details:
   - Position title and department
   - Reporting relationships
   - Core responsibilities
   - Detailed responsibilities
   - Salary range information
   - Department assignment
   - Personnel assigned to the role

### Understanding Timeline Visualizations <a name="understanding-timeline-visualizations"></a>

The timeline visualization shows the implementation phases and activities in chronological order.

1. Navigate to Timeline from the sidebar
2. View the vertical timeline display showing phases in chronological order
3. Each phase contains:
   - Title and timeframe
   - Description
   - List of activities
4. Click on any phase to expand it and see more details
5. Click on any activity to view its details

### Interpreting Budget Data <a name="interpreting-budget-data"></a>

The budget visualization provides insights into the financial implications of the quality department reorganization.

1. Navigate to Budget from the sidebar
2. View the overall budget summary at the top
3. See the budget breakdown by:
   - Factory (using the pie chart)
   - Role level (using the bar chart)
   - Department (using the table)
4. Use the factory selector to filter by specific factory
5. Use the time period selector to view budget projections for different periods

### Using the Resource Calculator <a name="using-the-resource-calculator"></a>

As a viewer, you can use the resource calculator in read-only mode to understand staffing recommendations.

1. Navigate to Resources from the sidebar
2. View the current work order volume and staffing levels
3. See the recommended staffing levels based on the current inputs
4. View the gap analysis showing where additional staffing is needed
5. Understand the calculation factors used to determine staffing needs

You can also view saved scenarios:
1. Navigate to Resources > Scenarios from the sidebar
2. View the list of saved staffing scenarios
3. Click on any scenario to view its details
4. Navigate to Resources > Compare to see scenario comparisons

## Troubleshooting <a name="troubleshooting"></a>

### Common Issues and Solutions

#### Login Problems

**Issue**: Unable to log in with correct credentials
**Solution**: 
1. Ensure you are using the correct email address
2. Reset your password using the "Forgot Password" link
3. Contact an administrator if you continue to have issues

#### Data Not Displaying

**Issue**: Organization structure or other data not displaying
**Solution**:
1. Refresh the page
2. Clear your browser cache
3. Try using a different browser
4. Contact an administrator if the issue persists

#### Slow Performance

**Issue**: Dashboard is loading slowly
**Solution**:
1. Check your internet connection
2. Close other browser tabs and applications
3. Clear your browser cache
4. Try using a different browser

#### Mobile/Tablet Display Issues

**Issue**: Content not displaying correctly on mobile or tablet
**Solution**:
1. Ensure you are using the latest version of your browser
2. Try rotating your device to landscape orientation
3. If using a tablet, try switching to desktop mode in your browser settings

## FAQ <a name="faq"></a>

### General Questions

**Q: How often is the data updated?**
A: The dashboard uses real-time data synchronization. Any changes made by administrators are immediately visible to all users.

**Q: Can I use the dashboard offline?**
A: No, the dashboard requires an internet connection to access the latest data.

**Q: Is my data secure?**
A: Yes, all data is stored securely in Firebase with appropriate security rules. User authentication is required to access sensitive information.

### Admin-Specific Questions

**Q: How do I add a new focus factory?**
A: Navigate to Admin > Data, click "Add Factory", fill in the factory details, and click "Save".

**Q: Can I delete a user account?**
A: Yes, navigate to Admin > Users, find the user you want to delete, click the "Delete" button, and confirm the deletion.

**Q: How do I backup all dashboard data?**
A: Navigate to Admin > Data, select "All data" in the export options, click "Export Data", and save the downloaded JSON file.

### Viewer-Specific Questions

**Q: Can I make changes to the organization structure as a viewer?**
A: No, viewers have read-only access. Contact an administrator if you need to suggest changes.

**Q: Can I save my own resource calculator scenarios?**
A: No, viewers cannot save scenarios. You can view existing scenarios but cannot create new ones.

**Q: How do I find a specific role or person?**
A: Use the search box in the header to search across all dashboard data, including roles and personnel.
