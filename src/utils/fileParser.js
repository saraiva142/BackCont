import csv from 'csv-parser';
import XLSX from 'xlsx';

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const { PassThrough } = require('stream');
    const bufferStream = new PassThrough();
    bufferStream.end(buffer);

    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(JSON.stringify(results, null, 2));
      })
      .on('error', reject);
  });
};

export const parseXLSX = (buffer) => {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new Error('Erro ao processar arquivo Excel');
  }
};

export const parsePDF = async (buffer) => {
  throw new Error('Processamento de PDF temporariamente desabilitado. Use arquivos CSV ou Excel.');
};