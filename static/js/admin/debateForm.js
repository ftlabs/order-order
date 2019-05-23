function addAdditionalTextFieldsListeners(
	action,
	actionFunction,
	appendFunction
) {
	const addTextButtons = document.querySelectorAll(
		'.' + action + '-text-field'
	);
	Array.from(addTextButtons).forEach(function(element) {
		const attributeName = `specialUsers[${element.parentElement.parentElement.getAttribute(
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
		const userInputs = Array.from(
			element.parentElement.parentElement.childNodes
		).find((element) =>
			element.classList
				? Array.from(element.classList).includes('user-inputs')
				: false
		);
		const inputElements = Array.from(userInputs.childNodes).filter(
			(element) => element.nodeName === 'INPUT'
		);
		const lastChild = inputElements[inputElements.length - 1];
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
	const newInput = document.createElement('input');
	newInput.classList.add('o-forms__text');
	newInput.setAttribute('type', 'text');
	if (attributeName) {
		newInput.setAttribute('name', attributeName);
	}
	newInput.required = true;
	userInputs.appendChild(newInput);
}

function addDebateTypeSelectListener() {
	const debateTypeSelector = document.querySelector('.debate-type');
	const specialUsersParentDiv = document.querySelector('.special-users');

	if (debateTypeSelector) {
		debateTypeSelector.addEventListener('change', function(e) {
			const specialUserDescription = getDebateTypeValues(
				this,
				'special-user-description'
			);
			const specialUserName = getDebateTypeValues(
				this,
				'special-user-name'
			);
			const displayName = this.value;
			const description = this.options[this.selectedIndex].getAttribute(
				'data-description'
			);

			const name = this.options[this.selectedIndex].getAttribute(
				'data-name'
			);
			const specialUsers = specialUserName.map((name, index) => ({
				name,
				description: specialUserDescription[index]
			}));
			while (specialUsersParentDiv.firstChild) {
				specialUsersParentDiv.removeChild(
					specialUsersParentDiv.firstChild
				);
			}
			specialUsers.forEach((specialUser) =>
				insertSpecialUser({ specialUsersParentDiv, ...specialUser })
			);

			updateDescription(description);
		});
	}
}

function updateDescription(description) {
	const debateDescriptions = document.querySelector('.debateDescription');
	debateDescriptions.innerHTML = description;
}

function insertSpecialUser({ specialUsersParentDiv, name, description }) {
	const parentDiv = document.createElement('div');
	parentDiv.classList.add('o-forms');
	parentDiv.setAttribute('data-special-user-type', name);
	specialUsersParentDiv.appendChild(parentDiv);
	const titleLabel = document.createElement('label');
	titleLabel.classList.add('o-forms__label');
	titleLabel.setAttribute('for', name);
	titleLabel.innerHTML = name;
	parentDiv.appendChild(titleLabel);
	const descriptionDiv = document.createElement('div');
	descriptionDiv.classList.add('o-forms__additional-info');
	descriptionDiv.setAttribute('id', 'text-box-info');
	descriptionDiv.innerHTML = description;
	parentDiv.appendChild(descriptionDiv);
	const userInputDiv = document.createElement('div');
	userInputDiv.classList.add('user-inputs');
	parentDiv.appendChild(userInputDiv);
	const customElementButtons = document.createElement('div');
	customElementButtons.classList.add('custom-element-buttons');
	parentDiv.appendChild(customElementButtons);
	addPlusAndMinusButtons(customElementButtons, 'add', name);
	addPlusAndMinusButtons(customElementButtons, 'remove');
}

function addPlusAndMinusButtons(parentElement, type, name) {
	const button = document.createElement('button');
	button.setAttribute('class', `${type}-text-field o-buttons`);
	button.setAttribute('type', 'button');
	parentElement.appendChild(button);
	const buttonSpan = document.createElement('span');
	buttonSpan.setAttribute('class', 'o-buttons-icon__label');
	buttonSpan.innerHTML = type === 'add' ? 'Add' : 'Remove';
	button.appendChild(buttonSpan);

	if (type === 'add') {
		const attributeName = `specialUsers[${name}]`;
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
	const value = selector.options[selector.selectedIndex]
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
