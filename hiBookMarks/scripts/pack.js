const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const packageJson = require('../package.json');

// 创建发布目录
const publishDir = path.join(__dirname, '../publish');
if (!fs.existsSync(publishDir)) {
  fs.mkdirSync(publishDir, { recursive: true });
}

// 获取版本号和扩展名
const version = packageJson.version;
const extensionName = packageJson.name;
const zipFileName = `${extensionName}-v${version}.zip`;
const zipFilePath = path.join(publishDir, zipFileName);

// 创建zip文件
const output = fs.createWriteStream(zipFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // 最高压缩级别
});

console.log(`🚀 开始打包 ${extensionName} v${version}...`);

// 监听事件
output.on('close', function() {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ 打包完成！`);
  console.log(`📦 文件名: ${zipFileName}`);
  console.log(`📏 文件大小: ${sizeInMB} MB`);
  console.log(`📍 文件路径: ${zipFilePath}`);
  console.log(`\n🎉 Chrome 扩展打包完成，可以上传到 Chrome Web Store！`);
});

archive.on('error', function(err) {
  console.error('❌ 打包失败:', err);
  process.exit(1);
});

// 连接输出流
archive.pipe(output);

// 添加dist目录的所有文件到zip
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist目录不存在，请先运行 npm run build');
  process.exit(1);
}

// 验证dist/manifest.json的版本号是否正确
const manifestPath = path.join(distPath, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.version === version) {
      console.log(`✅ manifest.json版本号正确: v${version}`);
    } else {
      console.warn(`⚠️  版本号不匹配! package.json: v${version}, manifest.json: v${manifest.version}`);
    }
  } catch (error) {
    console.warn('⚠️  无法读取manifest.json:', error.message);
  }
} else {
  console.warn('⚠️  未找到manifest.json文件');
}

// 递归添加dist目录中的所有文件
archive.directory(distPath, false);

// 完成打包
archive.finalize(); 