package com.example.CRW.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.CRW.exception.OurException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class AwsS3Service {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String awsRegion;

    @Value("${aws.s3.access.key:}")
    private String awsS3AccessKey;

    @Value("${aws.s3.secret.key:}")
    private String awsS3SecretKey;

    public String saveImageToS3(MultipartFile photo) {

        String s3LocationImage=null;

        try {
            if (!StringUtils.hasText(bucketName)) {
                throw new OurException("AWS_S3_BUCKET environment variable must be set");
            }

            String s3fileName = photo.getOriginalFilename();

            AWSCredentialsProvider credentialsProvider = new DefaultAWSCredentialsProviderChain();
            if (StringUtils.hasText(awsS3AccessKey) && StringUtils.hasText(awsS3SecretKey)) {
                BasicAWSCredentials awsCredentials =
                        new BasicAWSCredentials(awsS3AccessKey, awsS3SecretKey);
                credentialsProvider = new AWSStaticCredentialsProvider(awsCredentials);
            }

            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withCredentials(credentialsProvider)
                    .withRegion(Regions.fromName(awsRegion))
                    .build();

            InputStream inputStream = photo.getInputStream();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/jpeg");


            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3fileName, inputStream, metadata);

            s3Client.putObject(putObjectRequest);

            return "https://" + bucketName + ".s3.amazonaws.com/" + s3fileName;

        } catch (Exception e) {
            throw new OurException("Unable to upload image to S3 bucket " + e.getMessage());
        }
    }
}
