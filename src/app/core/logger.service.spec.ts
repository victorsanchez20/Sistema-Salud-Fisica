import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    logger = TestBed.inject(LoggerService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('error escribe el mensaje y el detalle en desarrollo', () => {
    const espia = vi.spyOn(console, 'error').mockImplementation(() => {});
    const detalle = { status: 500 };
    logger.error('Fallo', detalle);
    expect(espia).toHaveBeenCalledWith('Fallo', detalle);
  });

  it('error sin detalle escribe solo el mensaje', () => {
    const espia = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Fallo');
    expect(espia).toHaveBeenCalledWith('Fallo');
  });

  it('warn escribe el mensaje y el detalle en desarrollo', () => {
    const espia = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('Aviso', 'dato');
    expect(espia).toHaveBeenCalledWith('Aviso', 'dato');
  });
});
