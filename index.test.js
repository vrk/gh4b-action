const https = require('https');
const { getDogUrl, getDataStream } = require('./index');

jest.mock('node-fetch');
jest.mock('https');

describe('getDogUrl', () => {
    it('should return a URL if HTTP call is successful', async () => {
        const mockResponse = {
            ok: true,
            status: 200,
            statusText: 'OK',
            json: jest.fn().mockResolvedValue({ message: "https://example.com/dog.png", status: "success" })
        };

        require('node-fetch').mockResolvedValue(mockResponse);

        const url = await getDogUrl();

        expect(url).toBe('https://example.com/dog.png');
        expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should raise an error for a failed HTTP call', async () => {
        const mockResponse = {
            ok: false,
            status: 404,
            statusText: 'Not Found',
        };

        require('node-fetch').mockResolvedValue(mockResponse);

        await expect(getDogUrl()).rejects.toThrow('Fetch failed with status: 404 Not Found');
    });
});

describe('getDataStream', () => {
    it('should return a data stream if HTTP call is successful', async () => {
        const mockResponse = {
            statusCode: 200,
        };


        https.get.mockImplementation((url, callback) => {
            callback(mockResponse);
        });

        const dataStream = await getDataStream('https://example.com/dog.png');

        expect(dataStream).toBe(mockResponse);
        expect(https.get).toHaveBeenCalled();
    });

    it('should raise an error for a failed HTTP call', async () => {
        const mockResponse = {
            statusCode: 404,
            statusMessage: 'Not Found',
        };

        https.get.mockImplementation((url, callback) => {
            callback(mockResponse);
        });

        await expect(getDataStream('https://example.com/nonexistent.png')).rejects.toThrow(
            'Download failed with status code 404 Not Found'
        );
    });
});
