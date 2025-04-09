// Test cases for personnel placement feature
console.log("Running tests for personnel placement feature...");

// Test case 1: Verify personnel list rendering
function testPersonnelListRendering() {
  console.log("Test 1: Verifying personnel list rendering");
  const personnelList = document.getElementById('personnelList');
  if (!personnelList) {
    console.error("FAIL: Personnel list element not found");
    return false;
  }
  
  // Check if personnel stats are displayed
  const statsDiv = personnelList.querySelector('.personnel-stats');
  if (!statsDiv) {
    console.error("FAIL: Personnel stats not found");
    return false;
  }
  
  // Check if filter input is displayed
  const filterInput = personnelList.querySelector('.personnel-filter');
  if (!filterInput) {
    console.error("FAIL: Personnel filter not found");
    return false;
  }
  
  // Check if personnel items are displayed
  const personnelItems = personnelList.querySelectorAll('.personnel-item');
  if (personnelItems.length === 0) {
    console.error("FAIL: No personnel items found");
    return false;
  }
  
  console.log("PASS: Personnel list rendering verified");
  return true;
}

// Test case 2: Verify org chart rendering
function testOrgChartRendering() {
  console.log("Test 2: Verifying org chart rendering");
  const orgChart = document.querySelector('.org-chart');
  if (!orgChart) {
    console.error("FAIL: Org chart element not found");
    return false;
  }
  
  // Check if org levels are displayed
  const orgLevels = orgChart.querySelectorAll('.org-level');
  if (orgLevels.length === 0) {
    console.error("FAIL: No org levels found");
    return false;
  }
  
  // Check if org nodes are displayed
  const orgNodes = orgChart.querySelectorAll('.org-node');
  if (orgNodes.length === 0) {
    console.error("FAIL: No org nodes found");
    return false;
  }
  
  // Check if org node content (drop zones) are displayed
  const dropZones = orgChart.querySelectorAll('.org-node-content');
  if (dropZones.length === 0) {
    console.error("FAIL: No drop zones found");
    return false;
  }
  
  console.log("PASS: Org chart rendering verified");
  return true;
}

// Test case 3: Verify factory selector functionality
function testFactorySelectorFunctionality() {
  console.log("Test 3: Verifying factory selector functionality");
  const factoryButtons = document.querySelectorAll('.factory-btn');
  if (factoryButtons.length === 0) {
    console.error("FAIL: No factory buttons found");
    return false;
  }
  
  // Check if factory 1 is initially selected
  const factory1Button = document.querySelector('.factory-btn[data-factory="1"]');
  if (!factory1Button || !factory1Button.classList.contains('active')) {
    console.error("FAIL: Factory 1 is not initially selected");
    return false;
  }
  
  // Simulate click on factory 2 button
  const factory2Button = document.querySelector('.factory-btn[data-factory="2"]');
  if (!factory2Button) {
    console.error("FAIL: Factory 2 button not found");
    return false;
  }
  
  // Trigger click event on factory 2 button
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  factory2Button.dispatchEvent(clickEvent);
  
  // Check if factory 2 is now selected
  if (!factory2Button.classList.contains('active')) {
    console.error("FAIL: Factory 2 is not selected after click");
    return false;
  }
  
  // Check if factory 1 is no longer selected
  if (factory1Button.classList.contains('active')) {
    console.error("FAIL: Factory 1 is still selected after clicking Factory 2");
    return false;
  }
  
  console.log("PASS: Factory selector functionality verified");
  return true;
}

// Test case 4: Verify drag and drop functionality
function testDragAndDropFunctionality() {
  console.log("Test 4: Verifying drag and drop functionality");
  // This test is more complex and would require simulating drag and drop events
  // For this demo, we'll just check if the necessary event listeners are attached
  
  // Check if personnel items are draggable
  const draggableItems = document.querySelectorAll('.personnel-item[draggable="true"]');
  if (draggableItems.length === 0) {
    console.error("FAIL: No draggable personnel items found");
    return false;
  }
  
  // Check if drop zones exist
  const dropZones = document.querySelectorAll('.org-node-content');
  if (dropZones.length === 0) {
    console.error("FAIL: No drop zones found");
    return false;
  }
  
  console.log("PASS: Drag and drop elements verified");
  return true;
}

// Test case 5: Verify add personnel functionality
function testAddPersonnelFunctionality() {
  console.log("Test 5: Verifying add personnel functionality");
  const addButton = document.getElementById('addPersonnelBtn');
  if (!addButton) {
    console.error("FAIL: Add personnel button not found");
    return false;
  }
  
  const modal = document.getElementById('addPersonnelModal');
  if (!modal) {
    console.error("FAIL: Add personnel modal not found");
    return false;
  }
  
  const form = document.getElementById('addPersonnelForm');
  if (!form) {
    console.error("FAIL: Add personnel form not found");
    return false;
  }
  
  // Simulate click on add button
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  addButton.dispatchEvent(clickEvent);
  
  // Check if modal is displayed
  if (modal.style.display !== 'flex') {
    console.error("FAIL: Modal not displayed after clicking add button");
    return false;
  }
  
  // Close modal
  const closeButton = modal.querySelector('.modal-close');
  if (!closeButton) {
    console.error("FAIL: Modal close button not found");
    return false;
  }
  
  closeButton.dispatchEvent(clickEvent);
  
  console.log("PASS: Add personnel functionality verified");
  return true;
}

// Run all tests
function runAllTests() {
  let passCount = 0;
  let totalTests = 5;
  
  if (testPersonnelListRendering()) passCount++;
  if (testOrgChartRendering()) passCount++;
  if (testFactorySelectorFunctionality()) passCount++;
  if (testDragAndDropFunctionality()) passCount++;
  if (testAddPersonnelFunctionality()) passCount++;
  
  console.log(`Test summary: ${passCount}/${totalTests} tests passed`);
  return passCount === totalTests;
}

// Execute tests when the page is fully loaded
window.addEventListener('load', function() {
  setTimeout(runAllTests, 1000); // Delay tests to ensure all scripts have initialized
});
