import axiosClient from './axiosClient';

// Export thêm các interface để dùng ở nơi khác
export interface UploadSubmissionResponse {
    id?: string;
    submission_id?: string;
    file_id?: string;
    job_id?: string;
    status?: string;
    submission?: {
        id?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

// Các hàm export giữ nguyên, nhưng đảm bảo axiosClient là bản mới nhất
export async function uploadSubmission(
    assignmentId: string,
    ownerLabel: string,
    file: File
): Promise<UploadSubmissionResponse> {
    const formData = new FormData();
    formData.append('assignment_id', assignmentId);
    formData.append('owner_label', ownerLabel);
    formData.append('file', file);

    const response = await axiosClient.post('/submissions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}

export async function analyzeSubmission(submissionId: string) {
    const response = await axiosClient.post(`/submissions/${submissionId}/analyze`);
    return response.data;
}

export async function detectReferences(submissionId: string) {
    const response = await axiosClient.post(`/submissions/${submissionId}/detect-references`);
    return response.data;
}

export async function parseCitations(submissionId: string) {
    const response = await axiosClient.post(`/submissions/${submissionId}/parse-citations`);
    return response.data;
}

export async function verifyMetadata(submissionId: string) {
    const response = await axiosClient.post(`/submissions/${submissionId}/verify-metadata`);
    return response.data;
}

const uploadService = {
    uploadSubmission,
    analyzeSubmission,
    detectReferences,
    parseCitations,
    verifyMetadata,
};

export default uploadService;