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
			const name = this.options[this.selectedIndex].getAttribute(
				'data-name'
			);
			const valid = this.options[this.selectedIndex].getAttribute(
				'data-valid'
			);

			checkDebateTypeError(valid);

			addSpecialUserElements(this, specialUsersParentDiv);
			addTagsElements(this, tagsParentDiv);

			updateDescription(description);
		});
	}
}

function checkDebateTypeError(valid) {
	var debateTypeError = document.querySelector('.valid-debate-type-error');
	var debateErrorMessage = document.querySelector(
		'.valid-debate-type-error-message'
	);

	if (!Array.from(debateTypeError.classList).includes('hide')) {
		debateTypeError.classList.add('hide');
		debateErrorMessage.innerHTML = '';
	}
	if (valid === 'false') {
		debateErrorMessage.innerHTML =
			'The files for your selected debate type dont exist yet. Please refer to the project documentation for steps to add them.';
		debateTypeError.classList.remove('hide');
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
	Array.from(tags).forEach(function(tag) {
		insertTags({
			tagsParentDiv,
			name: tag.name,
			description: tag.description
		});
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
	Array.from(specialUsers).forEach(function(specialUser) {
		insertSpecialUser({
			specialUsersParentDiv,
			name: specialUser.name,
			description: specialUser.description
		});
	});
}

function updateDescription(description) {
	var debateDescriptions = document.querySelector('.debateDescription');
	debateDescriptions.innerHTML = description;
}

function insertSpecialUser({ specialUsersParentDiv, name, description }) {
	var parentDiv = createElement({
		htmlTag: 'div',
		parent: specialUsersParentDiv,
		attributes: [
			{ name: 'class', value: 'o-forms' },
			{ name: 'data-special-user-type', value: name }
		]
	});

	createElement({
		htmlTag: 'label',
		parent: parentDiv,
		innerHTML: name,
		attributes: [
			{ name: 'class', value: 'o-forms__label' },
			{ name: 'for', value: name }
		]
	});

	createElement({
		htmlTag: 'div',
		parent: parentDiv,
		innerHTML: description,
		attributes: [
			{ name: 'class', value: 'o-forms__additional-info' },
			{ name: 'id', value: 'text-box-info' }
		]
	});

	createElement({
		htmlTag: 'div',
		parent: parentDiv,
		attributes: [{ name: 'class', value: 'user-inputs' }]
	});

	var customElementButtons = createElement({
		htmlTag: 'div',
		parent: parentDiv,
		attributes: [{ name: 'class', value: 'custom-element-buttons' }]
	});

	addPlusAndMinusButtons(customElementButtons, 'add', name);
	addPlusAndMinusButtons(customElementButtons, 'remove');
}

function insertTags({ tagsParentDiv, name, description }) {
	var parentDiv = createElement({
		htmlTag: 'div',
		parent: tagsParentDiv,
		attributes: [
			{ name: 'class', value: 'o-forms' },
			{ name: 'data-tag-type', value: name }
		]
	});

	var userInputDiv = createElement({
		htmlTag: 'div',
		parent: parentDiv,
		attributes: [{ name: 'class', value: 'user-inputs' }]
	});

	var checkBoxParent = createElement({
		htmlTag: 'div',
		parent: userInputDiv,
		attributes: [{ name: 'class', value: 'o-forms__group' }]
	});

	createElement({
		htmlTag: 'span',
		parent: checkBoxParent,
		innerHTML: name,
		attributes: [{ name: 'class', value: 'o-forms__label' }]
	});

	createElement({
		htmlTag: 'input',
		parent: checkBoxParent,
		attributes: [
			{ name: 'class', value: 'o-forms__checkbox' },
			{ name: 'type', value: 'checkbox' },
			{ name: 'name', value: 'tags[]' },
			{ name: 'value', value: name },
			{ name: 'id', value: name }
		]
	});

	createElement({
		htmlTag: 'label',
		parent: checkBoxParent,
		innerHTML: description,
		attributes: [
			{ name: 'class', value: 'o-forms__label' },
			{ name: 'type', value: 'checkbox' },
			{ name: 'aria-hidden', value: 'true' },
			{ name: 'for', value: name }
		]
	});
}

function createElement({ htmlTag, parent, attributes, innerHTML }) {
	var element = document.createElement(htmlTag);
	if (attributes) {
		Array.from(attributes).forEach(function(attribute) {
			element.setAttribute(attribute.name, attribute.value);
		});
	}
	if (parent) {
		parent.appendChild(element);
	}
	if (innerHTML) {
		element.innerHTML = innerHTML;
	}
	return element;
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
