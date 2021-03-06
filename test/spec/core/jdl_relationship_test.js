/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
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

/* eslint-disable no-new, no-unused-expressions */
const expect = require('chai').expect;

const JDLEntity = require('../../../lib/core/jdl_entity');
const JDLRelationship = require('../../../lib/core/jdl_relationship');
const RelationshipTypes = require('../../../lib/core/jhipster/relationship_types');

describe('JDLRelationship', () => {
  describe('::new', () => {
    context('when not passing at least one injected field', () => {
      it('fails', () => {
        expect(() => {
          new JDLRelationship({
            from: new JDLEntity({
              name: 'Abc'
            }),
            to: new JDLEntity({
              name: 'Abc2'
            }),
            type: RelationshipTypes.MANY_TO_MANY
          });
        }).to.throw('The type, and at least one injected field must be passed');
      });
    });
    context('when having invalid entities as source and/or destination', () => {
      it('fails', () => {
        expect(() => {
          new JDLRelationship({
            from: {},
            to: new JDLEntity({
              name: 'Abc2'
            }),
            injectedFieldInFrom: 'something'
          });
        }).to.throw('Valid source and destination entities are required.');
        expect(() => {
          new JDLRelationship({
            from: new JDLEntity({
              name: 'Abc1'
            }),
            to: {},
            injectedFieldInFrom: 'something'
          });
        }).to.throw('Valid source and destination entities are required.');
        expect(() => {
          new JDLRelationship({
            from: {},
            to: {},
            injectedFieldInFrom: 'something'
          });
        }).to.throw('Valid source and destination entities are required.');
      });
    });
    context('when passing an invalid type', () => {
      it('fails', () => {
        expect(() => {
          new JDLRelationship({
            from: new JDLEntity({
              name: 'Abc'
            }),
            to: new JDLEntity({
              name: 'Abc2'
            }),
            injectedFieldInFrom: 'something',
            type: 'WRONG_TYPE'
          });
        }).to.throw('The type, and at least one injected field must be passed.');
      });
    });
    context('when passing valid args', () => {
      let relationship = null;

      before(() => {
        relationship = new JDLRelationship({
          from: new JDLEntity({
            name: 'Abc'
          }),
          to: new JDLEntity({
            name: 'Abc2'
          }),
          injectedFieldInFrom: 'something',
          type: RelationshipTypes.ONE_TO_ONE
        });
      });

      it('succeeds', () => {
        expect(relationship.to.name).to.eq('Abc2');
        expect(relationship.from.name).to.eq('Abc');
        expect(relationship.injectedFieldInFrom).to.eq('something');
        expect(relationship.type).to.eq(RelationshipTypes.ONE_TO_ONE);
      });
    });
  });
  describe('::isValid', () => {
    context('when checking the validity of an invalid object', () => {
      context('because it is nil or invalid', () => {
        it('returns false', () => {
          expect(JDLRelationship.isValid(null)).to.be.false;
          expect(JDLRelationship.isValid(undefined)).to.be.false;
        });
      });
      context('because the entities are invalid', () => {
        it('returns false', () => {
          expect(
            JDLRelationship.isValid({
              from: {},
              to: { name: 'Valid', tableName: 't_valid', fields: [] },
              type: RelationshipTypes.MANY_TO_MANY,
              injectedFieldInFrom: 'something'
            })
          ).to.be.false;
          expect(JDLRelationship.isValid({
            to: {},
            from: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.MANY_TO_MANY,
            injectedFieldInFrom: 'something'
          })).to.be.false;
        });
      });
      context('because the type is invalid', () => {
        it('returns false', () => {
          expect(
            JDLRelationship.isValid({
              from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
              to: { name: 'Valid', tableName: 't_valid', fields: [] },
              type: 'WRONG',
              injectedFieldInFrom: 'something'
            })
          ).to.be.false;
        });
      });
      context('because it lacks an injected field', () => {
        it('returns false', () => {
          expect(
            JDLRelationship.isValid({
              from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
              to: { name: 'Valid', tableName: 't_valid', fields: [] },
              type: RelationshipTypes.MANY_TO_MANY
            })
          ).to.be.false;
        });
      });
    });
    context('when passing a valid object', () => {
      it('returns true', () => {
        expect(
          JDLRelationship.isValid({
            from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.MANY_TO_MANY,
            injectedFieldInFrom: 'something'
          })
        ).to.be.true;
      });
    });
  });
  describe('#validate', () => {
    context('when passing an incorrect relationship', () => {
      context('because it is invalid', () => {
        let relationship = null;

        before(() => {
          relationship = new JDLRelationship({
            from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.MANY_TO_MANY,
            injectedFieldInFrom: 'something'
          });
          relationship.injectedFieldInFrom = null;
        });

        it('fails', () => {
          expect(() => {
            relationship.validate();
          }).to.throw('The exception is not in a valid state.\nErrors: Declaration error (no injected field in both sides).');
        });
      });
      context('because the type doesn\'t exist', () => {
        let relationship = null;

        before(() => {
          relationship = new JDLRelationship({
            from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.MANY_TO_MANY,
            injectedFieldInFrom: 'something'
          });
          relationship.type = 'WRONG';
        });

        it('fails', () => {
          expect(() => {
            relationship.validate();
          }).to.throw('The exception is not in a valid state.\nErrors: Wrong type: got \'WRONG\'.');
        });
      });
      context('because the source entity is not in a One-to-One', () => {
        let relationship = null;

        before(() => {
          relationship = new JDLRelationship({
            from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.ONE_TO_ONE,
            injectedFieldInTo: 'something'
          });
        });

        it('fails', () => {
          expect(() => {
            relationship.validate();
          }).to.throw('In the One-to-One relationship from Valid2 to Valid, the source entity must possess the ' +
            'destination in a One-to-One  relationship, or you must invert the direction of the relationship.');
        });
      });
      context('because one of the injected fields is not present in a One-to-Many (not bidirectional)', () => {
        let relationship = null;

        before(() => {
          relationship = new JDLRelationship({
            from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.ONE_TO_MANY,
            injectedFieldInFrom: 'something'
          });
        });

        it('just adds the missing side', () => {
          relationship.validate();
          expect(relationship.injectedFieldInTo).to.eq('valid2');
          relationship.injectedFieldInFrom = null;
          relationship.validate();
          expect(relationship.injectedFieldInFrom).to.eq('valid');
        });
      });
      context('because both the sides are present in a Many-to-One (not unidirectional)', () => {
        let relationship = null;

        before(() => {
          relationship = new JDLRelationship({
            from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.MANY_TO_ONE,
            injectedFieldInFrom: 'something',
            injectedFieldInTo: 'somethingElse'
          });
        });

        it('fails', () => {
          expect(() => {
            relationship.validate();
          }).to.throw('In the Many-to-One relationship from Valid2 to Valid, only unidirectionality is supported f' +
            'or a Many-to-One relationship, you should create a bidirectional One-to-Many relationship instead.');
        });
      });
      context('because one of the sides is not present in a Many-to-Many (not bidirectional)', () => {
        let relationship = null;

        before(() => {
          relationship = new JDLRelationship({
            from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.MANY_TO_MANY,
            injectedFieldInFrom: 'something'
          });
        });

        it('fails', () => {
          expect(() => {
            relationship.validate();
          }).to.throw('In the Many-to-Many relationship from Valid2 to Valid, only bidirectionality is supported ' +
            'for a Many-to-Many relationship.');
        });
      });
    });
  });
  describe('#getId', () => {
    let relationship = null;

    before(() => {
      relationship = new JDLRelationship({
        from: new JDLEntity({ name: 'A' }),
        to: new JDLEntity({ name: 'B' }),
        type: RelationshipTypes.ONE_TO_ONE,
        injectedFieldInFrom: 'b'
      });
    });

    it('returns an unique representation of the relationship', () => {
      expect(relationship.getId()).to.eq(`${relationship.type}_${relationship.from.name}{${relationship.injectedFieldInFrom}}_${relationship.to.name}`);
    });
  });
  describe('#toString', () => {
    context('without any comment', () => {
      let relationship = null;

      before(() => {
        relationship = new JDLRelationship({
          from: new JDLEntity({ name: 'A' }),
          to: new JDLEntity({ name: 'B' }),
          type: RelationshipTypes.ONE_TO_ONE,
          injectedFieldInFrom: 'b'
        });
      });

      it('stringifies the relationship', () => {
        expect(relationship.toString()).to.eq(
          `relationship ${relationship.type} {
  ${relationship.from.name}{${relationship.injectedFieldInFrom}} to ${relationship.to.name}
}`
        );
      });
    });
    context('with comments for both sides', () => {
      let relationship = null;

      before(() => {
        relationship = new JDLRelationship({
          from: new JDLEntity({ name: 'A' }),
          to: new JDLEntity({ name: 'B' }),
          type: RelationshipTypes.ONE_TO_ONE,
          injectedFieldInFrom: 'b',
          commentInFrom: 'Some comment.',
          commentInTo: 'Some other comment.'
        });
      });

      it('stringifies the relationship', () => {
        expect(relationship.toString()).to.eq(
          `relationship ${relationship.type} {
  /**
   * ${relationship.commentInFrom}
   */
  ${relationship.from.name}{${relationship.injectedFieldInFrom}} to
  /**
   * ${relationship.commentInTo}
   */
  ${relationship.to.name}
}`
        );
      });
    });
    context('with a comment for the source side', () => {
      let relationship = null;

      before(() => {
        relationship = new JDLRelationship({
          from: new JDLEntity({ name: 'A' }),
          to: new JDLEntity({ name: 'B' }),
          type: RelationshipTypes.ONE_TO_ONE,
          injectedFieldInFrom: 'b',
          commentInFrom: 'Some comment.'
        });
      });

      it('stringifies the relationship', () => {
        expect(relationship.toString()).to.eq(
          `relationship ${relationship.type} {
  /**
   * ${relationship.commentInFrom}
   */
  ${relationship.from.name}{${relationship.injectedFieldInFrom}} to ${relationship.to.name}
}`
        );
      });
    });
    context('with a comment for the destination side', () => {
      let relationship = null;

      before(() => {
        relationship = new JDLRelationship({
          from: new JDLEntity({ name: 'A' }),
          to: new JDLEntity({ name: 'B' }),
          type: RelationshipTypes.ONE_TO_ONE,
          injectedFieldInFrom: 'b',
          commentInTo: 'Some other comment.'
        });
      });

      it('stringifies the relationship', () => {
        expect(relationship.toString()).to.eq(
          `relationship ${relationship.type} {
  ${relationship.from.name}{${relationship.injectedFieldInFrom}} to
  /**
   * ${relationship.commentInTo}
   */
  ${relationship.to.name}
}`
        );
      });
    });
    context('with only one injected field', () => {
      let relationship = null;

      before(() => {
        relationship = new JDLRelationship({
          from: new JDLEntity({ name: 'A' }),
          to: new JDLEntity({ name: 'B' }),
          type: RelationshipTypes.ONE_TO_ONE,
          injectedFieldInFrom: 'b'
        });
      });

      it('stringifies the relationship', () => {
        expect(relationship.toString()).to.eq(
          `relationship ${relationship.type} {
  ${relationship.from.name}{${relationship.injectedFieldInFrom}} to ${relationship.to.name}
}`
        );
      });
    });
    context('with both injected fields', () => {
      let relationship = null;

      before(() => {
        relationship = new JDLRelationship({
          from: new JDLEntity({ name: 'A' }),
          to: new JDLEntity({ name: 'B' }),
          type: RelationshipTypes.ONE_TO_ONE,
          injectedFieldInFrom: 'b',
          injectedFieldInTo: 'a(id)'
        });
      });

      it('stringifies the relationship', () => {
        expect(relationship.toString()).to.eq(
          `relationship ${relationship.type} {
  ${relationship.from.name}{${relationship.injectedFieldInFrom}} to ${relationship.to.name}{${relationship.injectedFieldInTo}}
}`
        );
      });
    });
  });
});
