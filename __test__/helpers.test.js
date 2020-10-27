const { hasUncaughtExceptionCaptureCallback } = require("process");

const {format_date, format_plural, format_url} = require('../utils/helpers');

test('format_date() returns a date string', ()=>{
    const date = new Date('2020-10-26 16:12:03');
    expect(format_date(date)).toBe('10/26/2020');
});

test('format_plural(word,amount) returns correct plurals', ()=>{
    const plural = 'tigers';
    const single = 'lion';
    expect(format_plural('tiger',2)).toBe(plural);
    expect(format_plural('lion',1)).toBe(single);
});

test('format_url() returns a simplified url string', ()=>{
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg');
    const url3 = format_url('https://www.google.com?=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});