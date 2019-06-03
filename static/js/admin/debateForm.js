function addAdditionalTextFieldsListeners(
	action,
	actionFunction,
	appendFunction
) {
	var addTextButtons = document.querySelectorAll(
		'.' + action + '-text-field'
	);
	Array.from(addTextButtons).forEach(function(element) {
		var attributeName = `specialUsers[${element.parentElement.parentElement.getAttribute(
			'data-special-user-type'
		)}]`;
		addEventListenerPlusAndMinus(
			element,
			actionFunction,
			appendFunction,
			attributeName
		);
	});
}

function addEventListenerPlusAndMinus(
	element,
	actionFunction,
	appendFunction,
	attributeName
) {
	element.addEventListener('click', function() {
		var userInputs = Array.from(
			element.parentElement.parentElement.childNodes
		).find(function(element) {
			return element.classList
				? Array.from(element.classList).includes('user-inputs')
				: false;
		});
		var inputElements = Array.from(userInputs.childNodes).filter(function(
			element
		) {
			return element.nodeName === 'INPUT';
		});
		var lastChild = inputElements[inputElements.length - 1];
		actionFunction(lastChild, userInputs, appendFunction, attributeName);
	});
}

function addNewUserField(lastChild, userInputs, appendFunction, attributeName) {
	if (lastChild && !lastChild.value) {
	} else {
		appendFunction(userInputs, attributeName);
	}
}

function removeNewUserField(lastChild, userInputs) {
	userInputs.removeChild(lastChild);
}

function addSingleTextBox(userInputs, attributeName) {
	var newInput = document.createElement('input');
	newInput.classList.add('o-forms__text');
	newInput.setAttribute('type', 'text');
	if (attributeName) {
		newInput.setAttribute('name', attributeName);
	}
	newInput.required = true;
	userInputs.appendChild(newInput);
}

function addDebateTypeSelectListener() {
	var debateTypeSelector = document.querySelector('.debate-type');
	var specialUsersParentDiv = document.querySelector('.special-users');
	var tagsParentDiv = document.querySelector('.tags');

	if (debateTypeSelector) {
		debateTypeSelector.addEventListener('change', function(e) {
			var displayName = this.value;
			var description = this.options[this.selectedIndex].getAttribute(
				'data-description'
			);

			addSpecialUserElements(this, specialUsersParentDiv);
			addTagsElements(this, tagsParentDiv);

			updateDescription(description);
		});
	}
}

function addTagsElements(element, tagsParentDiv) {
	var tagsDescription = getDebateTypeValues(element, 'tags-description');
	var tagsName = getDebateTypeValues(element, 'tags-name');
	var tags = tagsName.map(function(name, index) {
		return {
			name,
			description: tagsDescription[index]
		};
	});
	while (tagsParentDiv.firstChild) {
		tagsParentDiv.removeChild(tagsParentDiv.firstChild);
	}
	tags.forEach(function(tag) {
		insertTags({ tagsParentDiv, ...tag });
	});
}

function addSpecialUserElements(element, specialUsersParentDiv) {
	var specialUserDescription = getDebateTypeValues(
		element,
		'special-user-description'
	);
	var specialUserName = getDebateTypeValues(element, 'special-user-name');

	var specialUsers = specialUserName.map(function(name, index) {
		return {
			name,
			description: specialUserDescription[index]
		};
	});
	while (specialUsersParentDiv.firstChild) {
		specialUsersParentDiv.removeChild(specialUsersParentDiv.firstChild);
	}
	specialUsers.forEach(function(specialUser) {
		insertSpecialUser({ specialUsersParentDiv, ...specialUser });
	});
}

function updateDescription(description) {
	var debateDescriptions = document.querySelector('.debateDescription');
	debateDescriptions.innerHTML = description;
}

function insertSpecialUser({ specialUsersParentDiv, name, description }) {
	var parentDiv = document.createElement('div');
	parentDiv.classList.add('o-forms');
	parentDiv.setAttribute('data-special-user-type', name);
	specialUsersParentDiv.appendChild(parentDiv);
	var titleLabel = document.createElement('label');
	titleLabel.classList.add('o-forms__label');
	titleLabel.setAttribute('for', name);
	titleLabel.innerHTML = name;
	parentDiv.appendChild(titleLabel);
	var descriptionDiv = document.createElement('div');
	descriptionDiv.classList.add('o-forms__additional-info');
	descriptionDiv.setAttribute('id', 'text-box-info');
	descriptionDiv.innerHTML = description;
	parentDiv.appendChild(descriptionDiv);
	var userInputDiv = document.createElement('div');
	userInputDiv.classList.add('user-inputs');
	parentDiv.appendChild(userInputDiv);
	var customElementButtons = document.createElement('div');
	customElementButtons.classList.add('custom-element-buttons');
	parentDiv.appendChild(customElementButtons);
	addPlusAndMinusButtons(customElementButtons, 'add', name);
	addPlusAndMinusButtons(customElementButtons, 'remove');
}

function insertTags({ tagsParentDiv, name, description }) {
	var parentDiv = document.createElement('div');
	parentDiv.classList.add('o-forms');
	parentDiv.setAttribute('data-special-user-type', name);
	tagsParentDiv.appendChild(parentDiv);

	var userInputDiv = document.createElement('div');
	userInputDiv.classList.add('user-inputs');
	parentDiv.appendChild(userInputDiv);

	var titleLabel = document.createElement('label');
	titleLabel.classList.add('o-forms__label');
	titleLabel.setAttribute('for', name);
	userInputDiv.innerHTML = name;
	parentDiv.appendChild(titleLabel);

	var spanCheckbox = document.createElement('div');
	spanCheckbox.setAttribute('class', 'o-forms__group');
	userInputDiv.appendChild(spanCheckbox);

	// var checkLabel = document.createElement('label');
	// checkLabel.classList.add('o-forms__label');
	// spanCheckbox.appendChild(checkLabel);

	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.setAttribute('name', 'tags[]');
	input.classList.add('o-forms__checkbox');
	input.setAttribute('value', name);
	input.setAttribute('id', name);
	spanCheckbox.appendChild(input);

	var span = document.createElement('label');
	span.setAttribute('class', 'o-forms-input__label');
	span.setAttribute('aria-hidden', 'true');
	span.setAttribute('for', name);

	span.innerHTML = description;
	spanCheckbox.appendChild(span);
}

function addPlusAndMinusButtons(parentElement, type, name) {
	var button = document.createElement('button');
	button.setAttribute('class', `${type}-text-field o-buttons`);
	button.setAttribute('type', 'button');
	parentElement.appendChild(button);
	var buttonSpan = document.createElement('span');
	buttonSpan.setAttribute('class', 'o-buttons-icon__label');
	buttonSpan.innerHTML = type === 'add' ? 'Add' : 'Remove';
	button.appendChild(buttonSpan);

	if (type === 'add') {
		var attributeName = `specialUsers[${name}]`;
		addEventListenerPlusAndMinus(
			button,
			addNewUserField,
			addSingleTextBox,
			attributeName
		);
	} else {
		addEventListenerPlusAndMinus(button, removeNewUserField);
	}
}

function getDebateTypeValues(selector, attribute) {
	var value = selector.options[selector.selectedIndex]
		.getAttribute('data-' + attribute)
		.split(',');
	value.pop();
	return value;
}

function init() {
	addAdditionalTextFieldsListeners('add', addNewUserField, addSingleTextBox);
	addAdditionalTextFieldsListeners('remove', removeNewUserField);
	addDebateTypeSelectListener();
}

document.addEventListener('DOMContentLoaded', init);
