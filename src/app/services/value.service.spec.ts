import { TestBed } from '@angular/core/testing';

import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValueService
      ]
    });
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for getValue', () => {
    // Arrange
    // Act
    it('should return "My value"', () => {
      expect(service.getValue()).toBe("My value")
    })
  })

  describe('Test for setValue', () => {
    it('should change value', () => {
      expect(service.getValue()).toBe("My value")
      service.setValue('value changed')
      expect(service.getValue()).toBe("value changed")
    })
  })

  describe('Test for getPromise', () => {
    it('should return "promise value" from a promise with then', (doneFn) => {
      service.getPromiseValue()
      .then((value) => {
        // assert
        expect(value).toBe("Promise value")
        doneFn();
      })
    })
    it('should return "promise value" from a promise with async', async () => {
      const value = await service.getPromiseValue()
      expect(value).toBe("Promise value")
    })
  })

});
