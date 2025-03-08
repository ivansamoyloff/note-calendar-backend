import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      listen: jest.fn(),
    }),
  },
}));

describe('Main', () => {
  let mockListen: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockListen = jest.fn();
    process.env.PORT = '3030';
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should create the app and start listening', async () => {
    const app = await NestFactory.create(AppModule);
    app.listen = mockListen;

    await bootstrap();

    expect(mockListen).toHaveBeenCalledWith('3030');
    expect(mockListen).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in listen', async () => {
    const error = new Error('Listen failed');
    mockListen.mockRejectedValueOnce(error);

    const app = await NestFactory.create(AppModule);
    app.listen = mockListen;

    await expect(bootstrap()).rejects.toThrow('Listen failed');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error starting the server:',
      error,
    );
  });
});
