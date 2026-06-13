import { createRequire } from 'module';

describe('main bootstrap', () => {
  const requireModule = createRequire(__filename);
  const originalNodeEnv = process.env.NODE_ENV;
  const originalPort = process.env.PORT;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.NODE_ENV;
    delete process.env.PORT;
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.PORT = originalPort;
  });

  const setupMocks = () => {
    const app = {
      enableCors: jest.fn(),
      init: jest.fn().mockResolvedValue(undefined),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    const create = jest.fn().mockResolvedValue(app);
    const server = {};

    jest.doMock('@nestjs/core', () => ({
      NestFactory: { create },
    }));
    jest.doMock('express', () => ({
      __esModule: true,
      default: jest.fn(() => server),
    }));
    jest.doMock('@nestjs/platform-express', () => ({
      ExpressAdapter: class {
        constructor(server: unknown) {
          void server;
        }
      },
    }));
    jest.doMock('@nestjs/swagger', () => ({
      DocumentBuilder: class {
        setTitle() {
          return this;
        }
        setDescription() {
          return this;
        }
        setVersion() {
          return this;
        }
        addBearerAuth() {
          return this;
        }
        build() {
          return {};
        }
      },
      SwaggerModule: {
        createDocument: jest.fn().mockReturnValue({}),
        setup: jest.fn(),
      },
    }));
    jest.doMock('./app.module', () => ({
      AppModule: class AppModule {},
    }));

    return { app, create, server };
  };

  it('listens on port 3000 locally', async () => {
    const { app, create, server } = setupMocks();

    const mainModule = requireModule('./main') as { default: unknown };
    await new Promise((resolve) => setImmediate(resolve));

    expect(create).toHaveBeenCalledTimes(1);
    expect(app.init).toHaveBeenCalledTimes(1);
    expect(app.listen).toHaveBeenCalledWith(3000);
    expect(mainModule.default).toBe(server);
  });

  it('uses configured port locally', async () => {
    process.env.PORT = '4500';
    const { app } = setupMocks();

    requireModule('./main');
    await new Promise((resolve) => setImmediate(resolve));

    expect(app.listen).toHaveBeenCalledWith(4500);
  });

  it('does not listen in production', async () => {
    process.env.NODE_ENV = 'production';
    const { app } = setupMocks();

    requireModule('./main');
    await new Promise((resolve) => setImmediate(resolve));

    expect(app.init).toHaveBeenCalledTimes(1);
    expect(app.listen).not.toHaveBeenCalled();
  });
});
