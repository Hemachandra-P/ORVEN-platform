from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    ORGANIZATION_OWNER = "organization_owner"
    QA_ENGINEER = "qa_engineer"
    QA_LEAD = "qa_lead"
    DEVELOPER = "developer"