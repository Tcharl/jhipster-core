/**
 * Copyright 2013-2017 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const JHipsterApplicationExporter = require('../../../lib/export/jhipster_application_exporter');
const JDLApplication = require('../../../lib/core/jdl_application');

describe('JHipsterApplicationExporter', () => {
  describe('::exportApplication', () => {
    context('when passing invalid parameters', () => {
      context('such as undefined', () => {
        it('throws an error', () => {
          expect(() => {
            JHipsterApplicationExporter.exportApplication();
          }).to.throw('An application has to be passed to be exported.');
        });
      });
      context('such as an invalid application', () => {
        it('throws an error', () => {
          expect(() => {
            JHipsterApplicationExporter.exportApplication({
              config: {}
            });
          }).to.throw('The application must be valid in order to be converted.\n' +
            'Errors: No name, No authentication type, No build tool');
        });
      });
    });
    context('when passing valid arguments', () => {
      context('when exporting an application to JSON', () => {
        let content = null;
        let returned = null;

        before((done) => {
          returned = JHipsterApplicationExporter.exportApplication(new JDLApplication({
            config: {
              baseName: 'toto',
              packageName: 'com.mathieu.sample',
              enableTranslation: false,
              languages: ['en', 'fr'],
              jhipsterVersion: '4.9.0'
            }
          }));
          fs.readFile(path.join('.yo-rc.json'), { encoding: 'utf8' }, (err, data) => {
            if (err) {
              return done(err);
            }
            content = JSON.parse(data);
            return done();
          });
        });

        after(() => {
          fs.unlinkSync(path.join('.yo-rc.json'));
        });

        it('returns the exported application', () => {
          expect(returned['generator-jhipster'].jwtSecretKey).not.to.be.undefined;
          delete returned['generator-jhipster'].jwtSecretKey;
          expect(returned).to.deep.equal({
            entities: [],
            'generator-jhipster': {
              applicationType: 'monolith',
              authenticationType: 'jwt',
              baseName: 'toto',
              buildTool: 'maven',
              cacheProvider: 'ehcache',
              clientFramework: 'angularX',
              clientPackageManager: 'yarn',
              databaseType: 'sql',
              devDatabaseType: 'h2Disk',
              enableHibernateCache: true,
              enableSwaggerCodegen: false,
              enableTranslation: false,
              jhiPrefix: 'jhi',
              jhipsterVersion: '4.9.0',
              languages: [
                'en',
                'fr'
              ],
              messageBroker: false,
              nativeLanguage: 'en',
              packageFolder: 'com/mathieu/sample',
              packageName: 'com.mathieu.sample',
              prodDatabaseType: 'mysql',
              searchEngine: false,
              serverPort: '8080',
              serviceDiscoveryType: false,
              skipClient: false,
              skipServer: false,
              skipUserManagement: false,
              testFrameworks: [],
              useSass: false,
              websocket: false
            }
          });
        });
        it('exports it', () => {
          expect(content).not.to.be.undefined;
        });
        it('formats it', () => {
          expect(content['generator-jhipster']).not.to.be.undefined;
          const config = content['generator-jhipster'];
          expect(config.jwtSecretKey).not.to.be.undefined;
          delete config.jwtSecretKey;
          expect(config).to.deep.equal({
            applicationType: 'monolith',
            authenticationType: 'jwt',
            baseName: 'toto',
            buildTool: 'maven',
            cacheProvider: 'ehcache',
            clientFramework: 'angularX',
            clientPackageManager: 'yarn',
            databaseType: 'sql',
            devDatabaseType: 'h2Disk',
            enableSwaggerCodegen: false,
            enableTranslation: false,
            enableHibernateCache: true,
            jhiPrefix: 'jhi',
            jhipsterVersion: '4.9.0',
            languages: [
              'en',
              'fr'
            ],
            messageBroker: false,
            nativeLanguage: 'en',
            packageFolder: 'com/mathieu/sample',
            packageName: 'com.mathieu.sample',
            prodDatabaseType: 'mysql',
            searchEngine: false,
            serverPort: '8080',
            serviceDiscoveryType: false,
            skipClient: false,
            skipServer: false,
            skipUserManagement: false,
            testFrameworks: [],
            useSass: false,
            websocket: false
          });
        });
      });
    });
  });
  describe('::exportApplications', () => {
    context('when passing invalid parameters', () => {
      context('such as undefined', () => {
        it('throws an error', () => {
          expect(() => {
            JHipsterApplicationExporter.exportApplications();
          }).to.throw('Applications have to be passed to be exported.');
        });
      });
    });
    context('when passing valid arguments', () => {
      context('when exporting applications to JSON', () => {
        let returned = null;

        before('common setup for both applications', () => {
          returned = JHipsterApplicationExporter.exportApplications({
            toto: new JDLApplication({
              config: {
                baseName: 'toto',
                packageName: 'com.mathieu.toto',
                enableTranslation: false,
                languages: ['en', 'fr'],
                jhipsterVersion: '4.9.0'
              }
            }),
            titi: new JDLApplication({
              config: {
                baseName: 'titi',
                packageName: 'com.mathieu.titi',
                enableTranslation: false,
                languages: ['en', 'fr'],
                jhipsterVersion: '4.9.0'
              }
            })
          });
        });

        it('returns the exported applications', () => {
          expect(returned).to.have.lengthOf(2);
        });
        context('for the first application', () => {
          let content = null;

          before('setup for the first application', (done) => {
            fs.readFile(path.join('toto', '.yo-rc.json'), { encoding: 'utf8' }, (err, data) => {
              if (err) {
                return done(err);
              }
              content = JSON.parse(data);
              return done();
            });
          });

          after('cleanup for the fist application', () => {
            fs.unlinkSync(path.join('toto', '.yo-rc.json'));
            fs.rmdirSync('toto');
          });

          it('exports it', (done) => {
            fs.readFile(path.join('toto', '.yo-rc.json'), { encoding: 'utf8' }, done);
          });

          it('formats it', () => {
            expect(content['generator-jhipster']).not.to.be.undefined;
            const config = content['generator-jhipster'];
            expect(config.jwtSecretKey).not.to.be.undefined;
            delete config.jwtSecretKey;
            expect(config).to.deep.equal({
              applicationType: 'monolith',
              authenticationType: 'jwt',
              baseName: 'toto',
              buildTool: 'maven',
              cacheProvider: 'ehcache',
              clientFramework: 'angularX',
              clientPackageManager: 'yarn',
              databaseType: 'sql',
              devDatabaseType: 'h2Disk',
              enableSwaggerCodegen: false,
              enableTranslation: false,
              enableHibernateCache: true,
              jhiPrefix: 'jhi',
              jhipsterVersion: '4.9.0',
              languages: [
                'en',
                'fr'
              ],
              messageBroker: false,
              nativeLanguage: 'en',
              packageFolder: 'com/mathieu/toto',
              packageName: 'com.mathieu.toto',
              prodDatabaseType: 'mysql',
              searchEngine: false,
              serverPort: '8080',
              serviceDiscoveryType: false,
              skipClient: false,
              skipServer: false,
              skipUserManagement: false,
              testFrameworks: [],
              useSass: false,
              websocket: false
            });
          });
        });
        context('for the second application', () => {
          let content = null;

          before('setup for the first application', (done) => {
            fs.readFile(path.join('titi', '.yo-rc.json'), { encoding: 'utf8' }, (err, data) => {
              if (err) {
                return done(err);
              }
              content = JSON.parse(data);
              return done();
            });
          });

          after('cleanup for the fist application', () => {
            fs.unlinkSync(path.join('titi', '.yo-rc.json'));
            fs.rmdirSync('titi');
          });

          it('exports it', (done) => {
            fs.readFile(path.join('titi', '.yo-rc.json'), { encoding: 'utf8' }, done);
          });

          it('formats it', () => {
            expect(content['generator-jhipster']).not.to.be.undefined;
            const config = content['generator-jhipster'];
            expect(config.jwtSecretKey).not.to.be.undefined;
            delete config.jwtSecretKey;
            expect(config).to.deep.equal({
              applicationType: 'monolith',
              authenticationType: 'jwt',
              baseName: 'titi',
              buildTool: 'maven',
              cacheProvider: 'ehcache',
              clientFramework: 'angularX',
              clientPackageManager: 'yarn',
              databaseType: 'sql',
              devDatabaseType: 'h2Disk',
              enableSwaggerCodegen: false,
              enableTranslation: false,
              enableHibernateCache: true,
              jhiPrefix: 'jhi',
              jhipsterVersion: '4.9.0',
              languages: [
                'en',
                'fr'
              ],
              messageBroker: false,
              nativeLanguage: 'en',
              packageFolder: 'com/mathieu/titi',
              packageName: 'com.mathieu.titi',
              prodDatabaseType: 'mysql',
              searchEngine: false,
              serverPort: '8080',
              serviceDiscoveryType: false,
              skipClient: false,
              skipServer: false,
              skipUserManagement: false,
              testFrameworks: [],
              useSass: false,
              websocket: false
            });
          });
        });
      });
    });
  });
});
