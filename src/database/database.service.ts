import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  private getEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      user: configService.get<string>('DB_NAME'),
      password: configService.get<string>('DB_PASSWORD'),
      host: configService.get<string>('DB_HOST'),
      port: configService.get<string>('DB_POST'),
      database: 'Users',
      ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUAXX7uBr49GhGJwUPQr6BPAELjkwwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1M2M2ZmNmZDYtZTc2MC00NzIwLWJjMTItZWY4ODA2OGI5
ZWE0IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwODI0MTAzNTEzWhcNMzUwODIyMTAz
NTEzWjBAMT4wPAYDVQQDDDUzYzZmY2ZkNi1lNzYwLTQ3MjAtYmMxMi1lZjg4MDY4
YjllYTQgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAIRIovr82Mxjon34WMrxazd5rQXHuJtNUdFxREwIChGz81/rl3jnxx7O
ClfBOnDjGEomDg0PS8YNqyolhNIKZ44s8o+fCw6+275LGvmVVyK7Ivtd7w1QKaO9
ZJrKEIy54k94JsUPklUi5WDReIyERgBG6HhFRIau9pyumIK13YJdBs7CBoTFcD70
ZlQ057VcXfpN6QvNHq7nDtgm4IgkenkyRicZZue3iZFcIpl9cuw60Adlxg2Av/4n
DnEGwLv6rkgBjDIw6r37nEU4dfPsbOcYSepqnQ62SDlDKHNHxo2YUJheO1wjrfCS
uL0A4FXUDdQXpOfkxLv6U9ymWLDG5XxdNrdzyMiPUoN8yNvUry0hUM9hOzLfCy0F
CQWjnm5fLFqh6Mbu7GYUPBtCGtFRKmpf4QKDdY7gWE4ZKJaO+NqzLCRlwV9TmPHo
CbpA+7uXrXgIO32E5WfQBS/uTCuz3DiuMyPjrudCWGTxqr8DB4IbumFcf/lzP8NG
m0PJIPa02wIDAQABo0IwQDAdBgNVHQ4EFgQUfA7vF+ksf11ITaLuxRQPWh8OME0w
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBAEOy51fd2UvrowEgyWDg773hbYHmPNknG8VO/Qc6Ey1LM6w/WSJ2ODByb/5G
EKZbcYCK7S1jiVyjXaMxqTDerDCW9YVjkmNHfuTgw9wkNEWSaMX1jwSX0xd9/6pr
nSZZ/iuWzW8na2xiRAtgxrt4ZKhSAFrX0i/jeciyM9th70EpfdUV4p2jhIzzzyyW
fvKBi8wu86oXSWQNl7DxGqxHmwDbWYQPAh/Cd5LtLg8jrjXMriPB5nps10zxrQQ+
fyDcvApmYZykDP97yA14WOujRAlzQqcBoytZIPtthzWUVdzuqmO4TD3VbexHyPxF
WBT/zsTRBm+lctSA+Ts3Q7fG1xw1Wg1Fer1DOUjozNkwuDRv08Fw2x7WHc6jrwJN
oKoPGgU5l218et5/dgroGjBn4K3EiRnw0bxQ2xr0czMkGyHD7GX1Q1aCaE5dYHS6
+ZxV5M025+NDw4h1KSOq21C6j0c3uBR/8ChBMn8ACxadHCCPwvr/ehboBnAyOA/U
ZiN+Dg==
-----END CERTIFICATE-----`,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  async onModuleInit() {
    console.log('UserService → PostgreSQL connecting...');
    const client = await this.pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('UserService DB Connected at:', res.rows[0].now);
    client.release();
  }

  async onModuleDestroy() {
    console.log('UserService → PostgreSQL closing...');
    await this.pool.end();
  }

  query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}
