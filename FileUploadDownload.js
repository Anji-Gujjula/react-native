import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

const FileUploadDownload = () => {
    const [file, setFile] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState('');

    const selectFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setFile(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                alert('Canceled');
            } else {
                throw err;
            }
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: file.type,
        });

        try {
            const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error(error);
            alert('File upload failed');
        }
    };

    const downloadFile = async () => {
        const { config, fs } = RNFetchBlob;
        let DownloadDir = fs.dirs.DownloadDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: DownloadDir + '/downloadedFile.jpg', // Change file type accordingly
                description: 'File',
            },
        };

        config(options)
            .fetch('GET', 'http://localhost:8080/api/files/download/yourfile.jpg')
            .then((res) => {
                setDownloadStatus('File downloaded successfully');
            })
            .catch((error) => {
                console.error(error);
                setDownloadStatus('File download failed');
            });
    };

    return (
        <View style={styles.container}>
            <Button title="Select File" onPress={selectFile} />
            {file && <Text style={styles.text}>File Selected: {file.name}</Text>}
            <Button title="Upload File" onPress={uploadFile} />
            <Button title="Download File" onPress={downloadFile} />
            {downloadStatus !== '' && <Text style={styles.text}>{downloadStatus}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        margin: 10,
        fontSize: 16,
    },
});

export default FileUploadDownload;
