// personnel.js
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced personnel data with more details
    let personnel = [
        { id: 1, name: "John Smith", position: "Senior Quality Engineer", department: "Quality", skills: "ISO 9001, Six Sigma, Auditing", experience: "8 years", education: "BS in Engineering", certifications: "Six Sigma Black Belt" },
        { id: 2, name: "Maria Garcia", position: "Quality Manager", department: "Quality", skills: "Leadership, Process Improvement, Regulatory Compliance", experience: "12 years", education: "MS in Quality Management", certifications: "ASQ CQM" },
        { id: 3, name: "David Chen", position: "Quality Technician", department: "Quality", skills: "Testing, Documentation, Data Analysis", experience: "3 years", education: "AS in Quality Technology", certifications: "ASQ CQIA" },
        { id: 4, name: "Sarah Johnson", position: "Compliance Specialist", department: "Quality", skills: "Regulatory Affairs, Documentation, Auditing", experience: "6 years", education: "BS in Regulatory Science", certifications: "RAC" },
        { id: 5, name: "Michael Brown", position: "Systems Specialist", department: "Quality", skills: "Quality Systems, CAPA, Risk Management", experience: "7 years", education: "BS in Systems Engineering", certifications: "CSQE" },
        { id: 6, name: "Emily Davis", position: "Document Controller", department: "Quality", skills: "Documentation, Records Management, Compliance", experience: "4 years", education: "BA in Business Administration", certifications: "CQIA" },
        { id: 7, name: "Robert Wilson", position: "Quality Inspector", department: "Quality", skills: "Inspection, Testing, Reporting", experience: "5 years", education: "AS in Quality Assurance", certifications: "CQI" },
        { id: 8, name: "Jennifer Lee", position: "Quality Director", department: "Quality", skills: "Strategic Planning, Leadership, Business Development", experience: "15 years", education: "MBA, BS in Engineering", certifications: "ASQ CQE, PMP" }
    ];
    
    // Factory data with more detailed structure
    const factories = {
        1: { 
            name: "Factory 1 - Medical Devices", 
            assignments: {},
            details: {
                location: "Boston, MA",
                employees: 450,
                products: "Medical Devices, Surgical Equipment",
                certifications: "ISO 13485, FDA 21 CFR Part 820"
            }
        },
        2: { 
            name: "Factory 2 - Electronics", 
            assignments: {},
            details: {
                location: "Austin, TX",
                employees: 380,
                products: "Electronic Components, Circuit Boards",
                certifications: "ISO 9001, IPC-A-610"
            }
        },
        3: { 
            name: "Factory 3 - Automotive", 
            assignments: {},
            details: {
                location: "Detroit, MI",
                employees: 320,
                products: "Automotive Parts, Sensors",
                certifications: "IATF 16949, ISO 14001"
            }
        }
    };
    
    // Current factory
    let currentFactory = 1;
    
    // DOM elements
    const personnelList = document.getElementById('personnelList');
    const addPersonnelBtn = document.getElementById('addPersonnelBtn');
    const addPersonnelModal = document.getElementById('addPersonnelModal');
    const addPersonnelForm = document.getElementById('addPersonnelForm');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCloseBtnAlt = document.querySelector('.modal-close-btn');
    const factoryButtons = document.querySelectorAll('.factory-btn');
    const personnelFilter = document.getElementById('personnelFilter');
    const factoryTitle = document.getElementById('factoryTitle');
    const factoryDetails = document.getElementById('factoryDetails');
    
    // Initialize the page
    function init() {
        renderPersonnelList();
        setupDragAndDrop();
        loadAssignments();
        updateFactoryInfo();
        
        // Add event listeners
        setupEventListeners();
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        // Personnel filter
        if (personnelFilter) {
            personnelFilter.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filterPersonnelList(searchTerm);
            });
        }
        
        // Add personnel button
        addPersonnelBtn.addEventListener('click', () => {
            addPersonnelModal.style.display = 'flex';
        });
        
        // Modal close buttons
        modalCloseBtn.addEventListener('click', () => {
            addPersonnelModal.style.display = 'none';
        });
        
        modalCloseBtnAlt.addEventListener('click', () => {
            addPersonnelModal.style.display = 'none';
        });
        
        // Add personnel form
        addPersonnelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('personnelName').value;
            const position = document.getElementById('personnelPosition').value;
            const department = document.getElementById('personnelDepartment').value;
            const skills = document.getElementById('personnelSkills').value;
            const experience = document.getElementById('personnelExperience') ? document.getElementById('personnelExperience').value : '';
            const education = document.getElementById('personnelEducation') ? document.getElementById('personnelEducation').value : '';
            const certifications = document.getElementById('personnelCertifications') ? document.getElementById('personnelCertifications').value : '';
            
            // Generate a new ID (in a real app, this would come from the server)
            const newId = personnel.length > 0 ? Math.max(...personnel.map(p => p.id)) + 1 : 1;
            
            // Add new personnel
            personnel.push({
                id: newId,
                name,
                position,
                department,
                skills,
                experience,
                education,
                certifications
            });
            
            // Reset form and close modal
            addPersonnelForm.reset();
            addPersonnelModal.style.display = 'none';
            
            // Update the UI
            renderPersonnelList();
            setupDragAndDrop();
        });
        
        // Factory buttons
        factoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                factoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update current factory
                currentFactory = parseInt(btn.dataset.factory);
                
                // Update the UI
                renderAssignments();
                updateFactoryInfo();
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === addPersonnelModal) {
                addPersonnelModal.style.display = 'none';
            }
        });
    }
    
    // Filter personnel list based on search term
    function filterPersonnelList(searchTerm) {
        const items = personnelList.querySelectorAll('.personnel-item');
        
        items.forEach(item => {
            const name = item.querySelector('.personnel-name').textContent.toLowerCase();
            const position = item.querySelector('.personnel-position').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || position.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Update factory information
    function updateFactoryInfo() {
        if (factoryTitle) {
            factoryTitle.textContent = factories[currentFactory].name;
        }
        
        if (factoryDetails) {
            const details = factories[currentFactory].details;
            factoryDetails.innerHTML = `
                <div><strong>Location:</strong> ${details.location}</div>
                <div><strong>Employees:</strong> ${details.employees}</div>
                <div><strong>Products:</strong> ${details.products}</div>
                <div><strong>Certifications:</strong> ${details.certifications}</div>
            `;
        }
        
        // Update factory indicators on org nodes
        document.querySelectorAll('.factory-indicator').forEach(indicator => {
            indicator.textContent = currentFactory;
        });
    }
    
    // Render the personnel list
    function renderPersonnelList() {
        personnelList.innerHTML = '';
        
        // Add personnel stats
        const totalPersonnel = personnel.length;
        const assignedPersonnel = countAssignedPersonnel();
        const availablePersonnel = totalPersonnel - assignedPersonnel;
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'personnel-stats';
        statsDiv.innerHTML = `
            <div>Total: ${totalPersonnel}</div>
            <div>Assigned: ${assignedPersonnel}</div>
            <div>Available: ${availablePersonnel}</div>
        `;
        personnelList.appendChild(statsDiv);
        
        // Add filter input
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.className = 'personnel-filter';
        filterInput.id = 'personnelFilter';
        filterInput.placeholder = 'Search personnel...';
        personnelList.appendChild(filterInput);
        
        // Group personnel by assignment status
        const availablePersonnelList = [];
        const assignedPersonnelList = [];
        
        personnel.forEach(person => {
            if (isPersonnelAssigned(person.id)) {
                assignedPersonnelList.push(person);
            } else {
                availablePersonnelList.push(person);
            }
        });
        
        // Add available personnel
        if (availablePersonnelList.length > 0) {
            const availableHeader = document.createElement('div');
            availableHeader.className = 'personnel-category';
            availableHeader.textContent = 'Available Personnel';
            personnelList.appendChild(availableHeader);
            
            availablePersonnelList.forEach(person => {
                addPersonnelItemToList(person, false);
            });
        }
        
        // Add assigned personnel
        if (assignedPersonnelList.length > 0) {
            const assignedHeader = document.createElement('div');
            assignedHeader.className = 'personnel-category';
            assignedHeader.textContent = 'Assigned Personnel';
            personnelList.appendChild(assignedHeader);
            
            assignedPersonnelList.forEach(person => {
                addPersonnelItemToList(person, true);
            });
        }
        
        // Add event listeners for edit and remove buttons
        document.querySelectorAll('.edit-personnel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                editPersonnel(id);
            });
        });
        
        document.querySelectorAll('.remove-personnel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                removePersonnel(id);
            });
        });
    }
    
    // Add a personnel item to the list
    function addPersonnelItemToList(person, isAssigned) {
        const personnelItem = document.createElement('div');
        personnelItem.className = 'personnel-item';
        personnelItem.draggable = !isAssigned;
        personnelItem.dataset.id = person.id;
        
        personnelItem.innerHTML = `
            <div class="personnel-info">
                <div class="personnel-name">${person.name}</div>
                <div class="personnel-position">${person.position}</div>
            </div>
            <div class="personnel-actions">
                <button class="btn btn-small btn-outline edit-personnel" data-id="${person.id}">Edit</button>
                <button class="btn btn-small btn-accent remove-personnel" data-id="${person.id}">Remove</button>
            </div>
        `;
        
        if (isAssigned) {
            personnelItem.style.opacity = '0.6';
            personnelItem.title = 'Already assigned';
        }
        
        personnelList.appendChild(personnelItem);
    }
    
    // Count assigned personnel
    function countAssignedPersonnel() {
        let count = 0;
        for (const factoryId in factories) {
            const assignments = factories[factoryId].assignments;
            for (const role in assignments) {
                count += assignments[role].length;
            }
        }
        return count;
    }
    
    // Edit personnel
    function editPersonnel(personnelId) {
        const person = personnel.find(p => p.id === personnelId);
        if (!person) return;
        
        // In a real app, you would open a modal with a form pre-filled with the person's data
        // For this demo, we'll just show an alert
        alert(`Edit personnel: ${person.name}\nPosition: ${person.position}\nSkills: ${person.skills}`);
    }
    
    // Check if personnel is assigned to any role
    function isPersonnelAssigned(personnelId) {
        for (const factoryId in factories) {
            const assignments = factories[factoryId].assignments;
            for (const role in assignments) {
                if (assignments[role].includes(personnelId)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // Setup drag and drop functionality
    function setupDragAndDrop() {
        // Add drag start event to personnel items
        document.querySelectorAll('.personnel-item').forEach(item => {
            if (item.draggable) {
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.id);
                    item.classList.add('dragging');
                });
                
                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                });
            }
        });
        
        // Add drag over and drop events to role containers
        document.querySelectorAll('.org-node-content').forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                container.classList.add('drag-over');
            });
            
            container.addEventListener('dragleave', () => {
                container.classList.remove('drag-over');
            });
            
            container.addEventListener('drop', (e) => {
                e.preventDefault();
                container.classList.remove('drag-over');
                
                const personnelId = parseInt(e.dataTransfer.getData('text/plain'));
                const role = container.dataset.role;
                
                assignPersonnelToRole(personnelId, role);
            });
        });
    }
    
    // Assign personnel to role
    function assignPersonnelToRole(personnelId, role) {
        // Initialize assignments for the role if it doesn't exist
        if (!factories[currentFactory].assignments[role]) {
            factories[currentFactory].assignments[role] = [];
        }
        
        // Check if person
(Content truncated due to size limit. Use line ranges to read in chunks)