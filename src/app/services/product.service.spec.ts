import { CreateProductDTO, Product } from '../models/product.model';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { generateManyProducts, generateOneProduct } from '@models/product.mock';
import { ProductsService } from './products.service';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';

fdescribe('ProductsService', () => {
  let productService: ProductsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('test for getAllSimple', () => {
    it('should return a product list', doneFn => {
      //arrange
      const mockData: Product[] = generateManyProducts(2);
      //act
      productService.getAllSimple().subscribe(data => {
        //assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });

  describe('test for getAll', () => {
    it('should return a product list', doneFn => {
      //arrange
      const mockData: Product[] = generateManyProducts(3);
      //act
      productService.getAll().subscribe(data => {
        //assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return a product list with taxes', doneFn => {
      //arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, //100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, //200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, //0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // = 0
        },
      ];
      //act
      productService.getAll().subscribe(data => {
        //assert
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should work with params with limit 10 and offset 3', doneFn => {
      //arrange
      const mockData: Product[] = generateManyProducts(3);
      //act
      const limit = 10;
      const offset = 3;
      productService.getAll(limit, offset).subscribe(data => {
        //assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
    it('should work with params with limit 10 and offset 0', doneFn => {
      //arrange
      const mockData: Product[] = generateManyProducts(3);
      //act
      const limit = 10;
      const offset = 0;
      productService.getAll(limit, offset).subscribe(data => {
        //assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('test for create', () => {
    it('should return a new product', doneFn => {
      //Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'bla bla',
        categoryId: 13,
      };
      //Act
      productService.create({ ...dto }).subscribe(data => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });
});
