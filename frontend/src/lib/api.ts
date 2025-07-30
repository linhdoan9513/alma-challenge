import { LeadFormData } from "@/store/leadSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Auth API functions
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to login",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0,
      error
    );
  }
}

export async function getProfile(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to get profile",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0,
      error
    );
  }
}

// Lead API functions
export async function submitLeadForm(
  formData: LeadFormData | FormData
): Promise<ApiResponse> {
  try {
    const isFormData = formData instanceof FormData;

    const response = await fetch(`${API_BASE_URL}/leads/submit`, {
      method: "POST",
      headers: isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          },
      body: isFormData ? formData : JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to submit form",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0,
      error
    );
  }
}

export async function getLeads(
  token: string,
  params?: {
    limit?: number;
    offset?: number;
    search?: string;
    status?: string;
  }
) {
  try {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    const response = await fetch(`${API_BASE_URL}/leads?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to fetch leads",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0,
      error
    );
  }
}

export async function updateLeadStatus(
  token: string,
  leadId: string,
  status: "PENDING" | "REACHED_OUT"
) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || "Failed to update lead status",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0,
      error
    );
  }
}
