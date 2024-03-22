import { MasterService } from './master.service';
import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [MasterService, { provide: ValueService, useValue: spy }],
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(
      ValueService,
    ) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  // it('should return "my value" from the real service', () => {
  //   service = new ValueService()
  //   masterService = new MasterService(service);
  //   expect(masterService.getValue()).toBe('My value')
  // })
  it('should call getValue from ValueService', () => {
    // const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    valueServiceSpy.getValue.and.returnValue('Fake Value');

    // masterService = new MasterService(valueServiceSpy);
    expect(masterService.getValue()).toBe('Fake Value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
