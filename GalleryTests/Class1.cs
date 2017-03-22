using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace GalleryTests
{
    [TestFixture]
    public class Class1
    {
        [Test]
        public void FirstTest()
        {
            IWebDriver driver = new ChromeDriver();
            driver.Navigate().GoToUrl("http://localhost:49157/AngularRoute/Index/");
            driver.Manage().Window.Maximize();

            for (;;)
            {
                try
                {
                    driver.FindElement(By.Id("Angl")).Click();
                    System.Threading.Thread.Sleep(1000);
                }
                catch(NoSuchElementException)
                {
                    break;
                }
            }
            //driver.FindElement(By.Id("src")).SendKeys("asd");
            driver.Navigate().GoToUrl("http://localhost:49157/AngularRoute/Temp/");
            driver.FindElement(By.Id("name")).SendKeys("Vesely Skazochnik i plut");
            driver.FindElement(By.Id("src")).SendKeys("http://inosmi.ru/images/23863/55/238635518.jpg");
            driver.FindElement(By.Id("album")).SendKeys("Hello");
            //WebDriverWait i;
            System.Threading.Thread.Sleep(5000);
            //driver.Manage().Timeouts().ImplicitWait = (TimeSpan.FromSeconds(5));

            driver.Navigate().GoToUrl("http://localhost:49157/AngularRoute/Edit/");
            driver.FindElement(By.Id("Change")).Click();
            driver.FindElement(By.Id("text")).Clear();
            driver.FindElement(By.Id("text")).SendKeys("dfgoijdofgijdofigjodfigjdofigjodfgijdofgidofjgodfijgodfigjdofgjdlfgjstg'afdijg'dlkgjdfkgjdkfgjdkfgjdkfgjdkfgjsdk;lfgjdkfgjdkfgjkdfjgkdfjgkdfjgdkfjg'dlfjkgdkfjgkdfgjkdjga'dfkgjd'fkgjd'fgkdjf'gdfjgk'dfojgdf'gjdfkgjdkfg'a'fgj  dflgjdkfgjdkfgjdkfgjdfgts'eroijer ");
            driver.FindElement(By.Id("save")).Click();
            Assert.Pass();
            driver.Quit();

            //http://www.vcskicks.com/image-from-url.php
        }
    }
}
