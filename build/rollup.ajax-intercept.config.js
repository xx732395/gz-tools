import chalk from 'chalk'
import rollup from 'rollup'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import minimist from 'minimist'
import {
  terser
} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

// const argv = minimist(process.argv.slice(2))
// argv.format === 'iife'

const PRO_PLUGIN = []
if (process.env.NODE_ENV === 'production') {
  PRO_PLUGIN.push(terser({
    output: {
      ecma: 5
    }
  }))
}
const mduleName = 'ajax-intercept-hook'
export default {
  input: `packages/${mduleName}/src/index.ts`,
  output: {
    file: `packages/${mduleName}/lib/${process.env.NODE_ENV === 'production' ? 'index.min.js' : 'index.js'}`,
    name: 'GzTool',
    format: 'umd'
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true, // 生成.d.ts文件
        },
        include: [
          `packages/${mduleName}/src`
        ],
        exclude: [
          // 'node_modules',
          '__tests__',
          'lib',
          'example'
        ]
      },
      abortOnError: false
    }),
    // replace({
    //   preventAssignment: true,
    //   'process.env.NODE_ENV': JSON.stringify('development')
    // }),
    resolve(),
    commonjs(),
    babel({
      /*
      babelHelpers  // Default: 'bundled'
        Type: 'bundled' | 'runtime' | 'inline' | 'external' 
        'runtime' - rollup构建一个js包的时候，该配置要结合@babel/plugin-transform-runtime插件
        'bundled' - 如果用rollup构建一个项目的用此参数
        'inline' 官网不推荐使用，会导致很多重复性代码
        'external' 要结合@babel/plugin-external-helpers插件使用，它会把helpers 收集到一个共享模块，把helpers 抽到一个全局的共享模块又不会造成全局的污染 
      exclude  // 不转换那些模块，一般是配置成node_module
      include // 转换那些模块，一般很少用到
      extensions  // Default: ['.js', '.jsx', '.es6', '.es', '.mjs']
         Type: Array[...String] 
      */
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
      babelHelpers: 'runtime', // 需要转译代码的话 使用 'runtime'
      plugins: [
        ['@babel/plugin-transform-runtime',
          {
            useESModules: true,
            corejs: 3
          }
        ]
      ],
      presets: [
        ['@babel/preset-env',
          // { // 采用修改全局对象的方式去polyfill
          //   useBuiltIns: 'usage',   // entry 全量导入  "usage" 按需导入 
          //   corejs: 3,
          // }
        ]
      ]
    }),
    ...PRO_PLUGIN
  ]
}
