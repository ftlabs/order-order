function addAdditionalTextFieldsListeners(attributeName, appendFunction) {
	const addTextButtons = document.querySelectorAll(
		'.add-text-field-' + attributeName
	);
	Array.from(addTextButtons).forEach(function(element) {
		element.addEventListener('click', function() {
			const userInputs = Array.from(
				element.parentElement.parentElement.childNodes
			).find(function(element) {
				return element.classList
					? Array.from(element.classList).includes(
							attributeName + '-fields'
					  )
					: false;
			});

			const inputElements = Array.from(userInputs.childNodes).filter(
				function(element) {
					return element.nodeName === 'INPUT';
				}
			);
			const lastChild = inputElements[inputElements.length - 1];
			if (lastChild && !lastChild.value) {
				// show error for blank last box
			} else {
				appendFunction(attributeName, userInputs);
			}
		});
	});
}

function addRemoveTextFieldsListeners(attributeName) {
	const removeTextButtons = document.querySelectorAll('.remove-text-field');
	Array.from(removeTextButtons).forEach(function(element) {
		element.addEventListener('click', function() {
			const userInputs = Array.from(
				element.parentElement.parentElement.childNodes
			).find(function(element) {
				return element.classList
					? Array.from(element.classList).includes(
							attributeName + '-fields'
					  )
					: false;
			});
			const inputElements = Array.from(userInputs.childNodes).filter(
				function(element) {
					return element.nodeName === 'DIV';
				}
			);
			const lastChild = inputElements[inputElements.length - 1];

			userInputs.removeChild(lastChild);
		});
	});
}

function addSingleTextBox(attributeName, userInputs) {
	const newInput = document.createElement('input');
	newInput.classList.add('o-forms__text');
	newInput.setAttribute('type', 'text');
	newInput.setAttribute('name', attributeName);
	newInput.required = true;
	userInputs.appendChild(newInput);
}

function addNewUserField(attributeName, userInputs) {
	const newSpecialUserInputs = document.createElement('div');
	newSpecialUserInputs.classList.add('user-inputs');
	userInputs.appendChild(newSpecialUserInputs);

	createNewFieldForm('hello', newSpecialUserInputs);
}

function addNewTagField(attributeName, userInputs) {
	const newSpecialUserInputs = document.createElement('div');
	newSpecialUserInputs.classList.add('user-inputs');
	userInputs.appendChild(newSpecialUserInputs);

	createNewTagFormItem('hello', newSpecialUserInputs);
}

function addLabelToField(
	userInputs,
	formName,
	displayName,
	displayDescription
) {
	const label = document.createElement('label');
	label.setAttribute('for', formName);
	label.classList.add('o-forms__label');
	label.innerHTML = displayName;
	userInputs.appendChild(label);
	if (displayDescription) {
		const labelDiv = document.createElement('div');
		labelDiv.classList.add('o-forms__additional-info');
		labelDiv.setAttribute('id', 'text-box-info');
		labelDiv.innerHTML = displayDescription;
		userInputs.appendChild(labelDiv);
	}
}

function editCustomTextField(textField, saveButton, editButton) {
	textField.disabled = false;
	editButton.classList.add('hide');
	saveButton.classList.remove('hide');
}

function saveCustomTextField(textField, saveButton, editButton, userInputs) {
	textField.disabled = true;
	saveButton.classList.add('hide');
	editButton.classList.remove('hide');
	const inputElements = Array.from(userInputs.childNodes).filter(function(
		element
	) {
		return element.nodeName === 'INPUT';
	});
	if (inputElements.length === 0) {
		createNewFieldForm(textField.value, userInputs);
	}
}

function createNewFieldForm(attributeName, userInputs) {
	var index =
		Array.from(userInputs.parentElement.childNodes).filter(function(
			element
		) {
			return element.nodeName === 'DIV';
		}).length - 1;

	addLabelToField(
		userInputs,
		'name',
		'Field Name',
		'This is the name as it will appear in the database. Please use camel case.'
	);
	addSingleTextBox('specialUsers[' + index + '][name]', userInputs);
	addLabelToField(
		userInputs,
		'displayName',
		'Display Name',
		'This is the name that will show up in the create debate form when this type is selected.'
	);
	addSingleTextBox('specialUsers[' + index + '][displayName]', userInputs);
	addLabelToField(
		userInputs,
		'fieldDescription',
		'Field Description',
		'Please add a description for the field that will appear when a user creates a new debate of this type'
	);
	addSingleTextBox('specialUsers[' + index + '][description]', userInputs);
}

function createNewTagFormItem(attributeName, userInputs) {
	var index =
		Array.from(userInputs.parentElement.childNodes).filter(function(
			element
		) {
			element.nodeName === 'DIV';
		}).length - 1;

	addLabelToField(
		userInputs,
		'name',
		'Field Name',
		'This is the name as it will appear in the database. Please use camel case.'
	);
	addSingleTextBox('tags[' + index + '][name]', userInputs);
	addLabelToField(
		userInputs,
		'displayName',
		'Display Name',
		'This is the name that will show up in the create debate form when this type is selected.'
	);
	addSingleTextBox('tags[' + index + '][displayName]', userInputs);
	addLabelToField(
		userInputs,
		'fieldDescription',
		'Field Description',
		'Please add a description for the field that will appear when a user creates a new debate of this type'
	);
	addSingleTextBox('tags[' + index + '][description]', userInputs);
}

function init() {
	addAdditionalTextFieldsListeners('specialUsers', addNewUserField);
	addAdditionalTextFieldsListeners('tags', addNewTagField);

	addRemoveTextFieldsListeners('tags');
	addRemoveTextFieldsListeners('specialUsers');
}

document.addEventListener('DOMContentLoaded', init);
