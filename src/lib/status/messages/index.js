exports.internalErrorMessage = {
	message: "Error 500: Internal error",
	error: true,
};

exports.pageNotFoundMessage = {
	message: "Error 404: Page not found",
	error: true,
};

// Render properties
exports.renderDataInternalErrorMessage = {
	title: this.internalErrorMessage.message,
	subtitle: "If the error persists please contact us",
	messages: [this.internalErrorMessage]
};
