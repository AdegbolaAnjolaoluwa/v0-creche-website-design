package handlers

type ErrorBody struct {
	Code    string                 `json:"code"`
	Message string                 `json:"message"`
	Details map[string]interface{} `json:"details,omitempty"`
}

type ErrorResponseEnvelope struct {
	Error ErrorBody `json:"error"`
}

type HealthResponse struct {
	Status string `json:"status"`
}

