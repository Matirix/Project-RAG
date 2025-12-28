import mimetypes
import os
from typing import Optional

import boto3
from botocore.exceptions import ClientError


class S3BucketModel:
    def __init__(
        self,
        bucket_name: str,
        region_name: Optional[str] = None,
    ):
        self.bucket_name = bucket_name
        self.s3 = boto3.client("s3", region_name=region_name)

    def upload_bytes(
        self,
        data: bytes,
        key: str,
        content_type: Optional[str] = "application/octet-stream",
    ) -> None:
        try:
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=data,
                ContentType=content_type,
            )
        except ClientError as e:
            raise RuntimeError(f"Failed to upload bytes to S3: {e}")
